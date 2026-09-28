import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Camera, 
  Link as LinkIcon, 
  Trash2, 
  Lock, 
  RefreshCw, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { StudentVerificationData } from '../../types';

interface StudentVerificationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const StudentVerificationModal: React.FC<StudentVerificationModalProps> = ({ onClose, onSuccess }) => {
  const { currentUser, userProfile, updateLocalProfile } = useAuth();
  const { language } = useLanguage();

  const [coachingOrCollege, setCoachingOrCollege] = useState(
    userProfile?.studentVerificationData?.collegeOrCoaching || ''
  );
  const [rollNumber, setRollNumber] = useState(
    userProfile?.studentVerificationData?.rollOrIdNumber || ''
  );
  const [targetExam, setTargetExam] = useState(
    userProfile?.studentVerificationData?.courseOrExam || 'NEET'
  );

  // Storing photo and URL separately for mutual exclusion
  const initialIsLiveCamera = userProfile?.studentVerificationData?.isLiveCameraCaptured;
  const initialIdProof = userProfile?.studentVerificationData?.idProofUrl || '';

  const [capturedPhoto, setCapturedPhoto] = useState<string>(
    initialIsLiveCamera || initialIdProof.startsWith('data:image') ? initialIdProof : ''
  );
  const [externalUrl, setExternalUrl] = useState<string>(
    !initialIsLiveCamera && !initialIdProof.startsWith('data:image') ? initialIdProof : ''
  );

  // In-app camera stream state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const existingStatus = userProfile?.studentVerificationStatus;
  const isAlreadyVerified = userProfile?.isStudentVerified || existingStatus === 'verified';
  const isPending = existingStatus === 'pending';

  // Stop camera tracks helper
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsCameraInitializing(false);
  };

  // Fetch from protected private subcollection /users/{uid}/private/verification
  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    const fetchPrivateVerification = async () => {
      try {
        const privateRef = doc(db, 'users', currentUser.uid, 'private', 'verification');
        const snap = await getDoc(privateRef);
        if (snap.exists() && isMounted) {
          const data = snap.data() as StudentVerificationData;
          if (data.collegeOrCoaching) setCoachingOrCollege(data.collegeOrCoaching);
          if (data.rollOrIdNumber) setRollNumber(data.rollOrIdNumber);
          if (data.courseOrExam) setTargetExam(data.courseOrExam);
          if (data.idProofUrl) {
            if (data.isLiveCameraCaptured || data.idProofUrl.startsWith('data:image')) {
              setCapturedPhoto(data.idProofUrl);
              setExternalUrl('');
            } else {
              setExternalUrl(data.idProofUrl);
              setCapturedPhoto('');
            }
          }
        }
      } catch (err) {
        console.warn('Could not read private verification doc:', err);
      }
    };
    fetchPrivateVerification();
    return () => {
      isMounted = false;
      stopCameraStream();
    };
  }, [currentUser]);

  // Launch live camera view
  const handleStartCamera = async () => {
    if (externalUrl.trim()) return; // disabled if URL is entered
    setIsCameraInitializing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      setIsCameraInitializing(false);

      // Short delay to bind to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.warn('Video play warning:', err));
        }
      }, 100);
    } catch (err: any) {
      console.warn('getUserMedia failed, falling back to native device camera capture:', err);
      stopCameraStream();
      // On mobile browsers or restricted desktop, trigger native camera capture (no gallery)
      if (nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
      } else {
        toast.error(
          language === 'hi'
            ? 'कैमरा खोलने में असमर्थ। कृपया ब्राउज़र में कैमरा अनुमति दें।'
            : 'Could not access camera. Please allow camera permissions in browser settings.'
        );
      }
    }
  };

  // Capture frame from active video stream
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error(language === 'hi' ? 'कैमरा शुरू हो रहा है, कृपया एक सेकंड प्रतीक्षा करें...' : 'Camera starting, please wait a second...');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(compressedDataUrl);
        setExternalUrl(''); // clear URL so photo is exclusive
        stopCameraStream();
        toast.success(
          language === 'hi'
            ? 'आईडी कार्ड की लाइव फोटो कैप्चर हो गई!'
            : 'Live ID card photo captured!'
        );
      }
    } catch (err) {
      console.error('Snapshot capture error:', err);
      toast.error('Failed to capture snapshot');
    }
  };

  // Mobile Native Camera capture handler (capture="environment" restricts to camera only)
  const handleNativeCameraFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setCapturedPhoto(compressed);
        } else {
          setCapturedPhoto(readerEvent.target?.result as string);
        }
        setExternalUrl(''); // Clear URL so photo is exclusive
        toast.success(
          language === 'hi'
            ? 'कैमरा फोटो सफलतापूर्वक ली गई!'
            : 'Camera photo clicked and attached!'
        );
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setCapturedPhoto('');
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.value = '';
    }
    stopCameraStream();
  };

  const handleClearUrl = () => {
    setExternalUrl('');
  };

  // Form submission validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    if (!coachingOrCollege.trim()) {
      toast.error(language === 'hi' ? 'कृपया कोचिंग या कॉलेज का नाम भरें।' : 'Please enter coaching or college name.');
      return;
    }
    if (!rollNumber.trim()) {
      toast.error(language === 'hi' ? 'कृपया रोल नंबर या स्टूडेंट आईडी भरें।' : 'Please enter your roll number or student ID.');
      return;
    }

    // Mutual validation: exactly one must be provided
    const finalProofUrl = capturedPhoto || externalUrl.trim();
    if (!finalProofUrl) {
      toast.error(
        language === 'hi'
          ? 'अनिवार्य (*): कृपया कैमरे से फोटो खींचें या URL लिंक दर्ज करें।'
          : 'Mandatory (*): Please click a live photo with camera or enter a URL.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const fullVerificationPayload: StudentVerificationData = {
        collegeOrCoaching: coachingOrCollege.trim(),
        rollOrIdNumber: rollNumber.trim(),
        courseOrExam: targetExam.trim(),
        idProofUrl: finalProofUrl,
        isLiveCameraCaptured: !!capturedPhoto,
        submittedAt: Date.now(),
      };

      // 1. SECURE STORAGE: Save sensitive ID card proof & credentials in protected private subcollection
      const privateVerificationRef = doc(db, 'users', currentUser.uid, 'private', 'verification');
      await setDoc(privateVerificationRef, fullVerificationPayload);

      // 2. PUBLIC PROFILE: Only save badge status (Zero ID card photo / roll number leakage to public doc)
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        studentVerificationStatus: 'pending',
        updatedAt: Date.now(),
      });

      updateLocalProfile({
        studentVerificationStatus: 'pending',
        studentVerificationData: fullVerificationPayload,
      });

      toast.success(
        language === 'hi'
          ? 'सत्यापन अनुरोध सफलतापूर्वक सबमिट हो गया! मॉडरेटर 12-24 घंटे में समीक्षा करेंगे।'
          : 'Verification request submitted! Our community moderators verify within 12-24 hours.'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error submitting student verification:', err);
      toast.error('Failed to submit verification request: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mutual exclusion flags
  const isUrlEntered = externalUrl.trim().length > 0;
  const isPhotoCaptured = capturedPhoto.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#0c1017] border border-[#00E5FF]/30 p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            stopCameraStream();
            onClose();
          }}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/40 text-[#00E5FF]">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{language === 'hi' ? 'सत्यापित छात्र बैज प्राप्त करें' : 'Get "Verified Student" Badge'}</span>
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'hi'
                ? 'कोचिंग या कॉलेज आईडी सत्यापित करवाकर समुदाय में उच्च विश्वसनीयता पाएं।'
                : 'Free official trust badge for competitive exam aspirants & college students.'}
            </p>
          </div>
        </div>

        {/* Current Status Box if already applied or verified */}
        {isAlreadyVerified ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'hi' ? 'आप पहले से सत्यापित छात्र हैं!' : 'You are an Officially Verified Student!'}
              </h4>
              <p className="text-xs text-emerald-300">
                Your badge appears on your profile, roommate card, and marketplace listings.
              </p>
            </div>
          </div>
        ) : isPending ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-400 shrink-0 animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'hi' ? 'सत्यापन प्रक्रियाधीन है (Under Review)' : 'Verification Under Review'}
              </h4>
              <p className="text-xs text-amber-200">
                Your request submitted on {userProfile?.studentVerificationData?.submittedAt ? new Date(userProfile.studentVerificationData.submittedAt).toLocaleDateString() : 'recently'} is being reviewed by city moderators.
              </p>
            </div>
          </div>
        ) : null}

        {/* Anti-Fake Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 via-[#8A2BE2]/10 to-transparent border border-[#00E5FF]/20 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-white">
              {language === 'hi' ? 'फर्जी & AI इमेज पर 100% रोक नीति' : '100% Anti-Fake & AI Prevention Policy'}
            </p>
            <p className="text-[11px] text-gray-400">
              {language === 'hi'
                ? 'गैलरी अपलोड बंद है। केवल असली कार्ड की लाइव कैमरा फोटो या वेरीफाइड ड्राइव लिंक स्वीकार्य है। दोनों में से कोई एक अनिवार्य (*) है।'
                : 'Gallery upload is disabled to prevent AI fakes. Please click a live photo of your physical card or provide URL. One is mandatory (*).'}
            </p>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <span>{language === 'hi' ? 'कोचिंग संस्थान या कॉलेज का नाम' : 'Coaching Institute or College Name'}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              value={coachingOrCollege}
              onChange={(e) => setCoachingOrCollege(e.target.value)}
              placeholder="e.g. Allen Career Institute, PW Vidyapeeth, Motion, DU, etc."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'रोल नंबर / स्टूडेंट आईडी' : 'Roll No. / Student ID'}</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 24018274 or ALLEN-892"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'टारगेट परीक्षा या कोर्स' : 'Target Exam or Course'}</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-all"
              >
                <option value="NEET">NEET-UG Medical</option>
                <option value="JEE">JEE Main / Advanced</option>
                <option value="UPSC">UPSC Civil Services</option>
                <option value="SSC / Railway">SSC / Railway Exams</option>
                <option value="CUET / College">CUET / University College</option>
                <option value="CA / CS">CA / CS / Commerce</option>
                <option value="Other Aspirant">Other Competitive Exam</option>
              </select>
            </div>
          </div>

          {/* MUTUALLY EXCLUSIVE VERIFICATION PROOF SECTION */}
          <div className="space-y-3 p-4 rounded-2xl bg-black/50 border border-[#00E5FF]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-black text-white">
                  {language === 'hi' ? 'आईडी प्रूफ सत्यापन' : 'ID Proof Verification'}
                </span>
                <span className="text-rose-400 font-black text-sm">*</span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                {language === 'hi' ? 'कोई एक अनिवार्य (*)' : 'Either One Required (*)'}
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              {language === 'hi'
                ? 'नीचे दिए गए दो विकल्पों में से कोई एक चुनें। एक विकल्प का उपयोग करने पर दूसरा विकल्प अपने आप अक्षम हो जाएगा।'
                : 'Choose one of the two options below. Using one option automatically disables the other.'}
            </p>

            {/* Hidden native camera capture input - capture="environment" forces camera on mobile, avoiding gallery */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={nativeCameraInputRef}
              onChange={handleNativeCameraFile}
              className="hidden"
            />

            {/* OPTION 1: DIRECT CAMERA CLICK (NO GALLERY) */}
            <div 
              className={`p-3.5 rounded-xl border transition-all ${
                isUrlEntered
                  ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                  : isPhotoCaptured
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/[0.04] border-[#00E5FF]/30 hover:border-[#00E5FF]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>{language === 'hi' ? 'विकल्प 1: सीधे कैमरे से फोटो खींचें' : 'Option 1: Direct Live Camera Click'}</span>
                </span>
                {isUrlEntered ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{language === 'hi' ? 'अक्षम (URL दर्ज है)' : 'Disabled (URL active)'}</span>
                  </span>
                ) : isPhotoCaptured ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{language === 'hi' ? 'फोटो संलग्न है' : 'Photo Attached'}</span>
                  </span>
                ) : null}
              </div>

              {isUrlEntered ? (
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'आपने नीचे URL दर्ज किया है। कैमरा इस्तेमाल करने के लिए URL बॉक्स खाली करें।'
                      : 'URL is entered below. Clear the URL box if you want to take a camera photo instead.'}
                  </span>
                </p>
              ) : isPhotoCaptured ? (
                /* Captured Photo Preview Card */
                <div className="flex items-center gap-3 bg-black/60 p-2.5 rounded-xl border border-emerald-500/30">
                  <img
                    src={capturedPhoto}
                    alt="Captured ID"
                    className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'लाइव कैमरा फोटो सुरक्षित' : 'Live Camera Snapshot Ready'}</span>
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {language === 'hi' ? 'असली आईडी कार्ड की तस्वीर सफलतापूर्वक कैप्चर हो गई।' : 'Physical card captured with camera.'}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={handleStartCamera}
                        className="text-[11px] text-[#00E5FF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{language === 'hi' ? 'दोबारा खींचें' : 'Retake'}</span>
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title={language === 'hi' ? 'फोटो हटाएं' : 'Remove photo'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : isCameraActive ? (
                /* Live Camera Viewfinder In-Modal */
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border-2 border-[#00E5FF] flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Bounding box guide overlay */}
                    <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-[#00E5FF]/70 rounded-xl pointer-events-none flex flex-col items-center justify-between p-2">
                      <span className="text-[10px] bg-black/70 px-2 py-0.5 rounded text-[#00E5FF] font-semibold backdrop-blur-sm">
                        {language === 'hi' ? 'आईडी कार्ड को इस बॉक्स में रखें' : 'Place ID card inside this box'}
                      </span>
                      <span className="text-[9px] text-gray-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                        Keep text & photo sharp
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSnapPhoto}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#00E5FF]/20 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{language === 'hi' ? 'फोटो खींचें (Snap Photo)' : 'Snap Photo'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs transition-colors"
                    >
                      {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Click to Open Camera Trigger */
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleStartCamera}
                    disabled={isCameraInitializing}
                    className="w-full py-4 px-4 rounded-xl border border-dashed border-[#00E5FF]/40 hover:border-[#00E5FF] bg-[#00E5FF]/5 hover:bg-[#00E5FF]/10 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="p-2.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] group-hover:scale-110 transition-transform">
                      {isCameraInitializing ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">
                        {language === 'hi' ? 'कैमरा खोलें और सीधे फोटो खींचें' : 'Open Camera to Snap Physical Card'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {language === 'hi' ? 'गैलरी की फेक इमेज अस्वीकृत हैं • सिर्फ लाइव कैमरा क्लिक' : 'No gallery upload allowed • Direct live camera only'}
                      </span>
                    </div>
                  </button>

                  {/* Fallback button specifically for native phone camera */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="text-[10px] text-gray-400 hover:text-[#00E5FF] transition-colors underline"
                    >
                      {language === 'hi' ? 'मोबाइल का डिफॉल्ट कैमरा खोलें' : 'Launch device default camera'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SEPARATOR OR TEXT */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-gray-400 font-bold bg-[#0c1017] px-2">
                {language === 'hi' ? 'या (OR)' : 'OR'}
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* OPTION 2: IMAGE / DRIVE URL */}
            <div 
              className={`p-3.5 rounded-xl border transition-all ${
                isPhotoCaptured
                  ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                  : isUrlEntered
                  ? 'bg-[#00E5FF]/5 border-[#00E5FF]/40'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>{language === 'hi' ? 'विकल्प 2: फोटो / ड्राइव URL लिंक' : 'Option 2: Photo / Drive URL Link'}</span>
                </span>
                {isPhotoCaptured ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{language === 'hi' ? 'अक्षम (कैमरा फोटो सक्रिय है)' : 'Disabled (Camera active)'}</span>
                  </span>
                ) : isUrlEntered ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
                    {language === 'hi' ? 'URL सक्रिय' : 'URL Active'}
                  </span>
                ) : null}
              </div>

              {isPhotoCaptured ? (
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'कैमरे से फोटो ली जा चुकी है। URL दर्ज करने के लिए ऊपर से फोटो हटाएं।'
                      : 'Camera photo is already captured. Remove the photo above to type a URL instead.'}
                  </span>
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="url"
                      disabled={isPhotoCaptured}
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://... (Google Drive public link or direct image link)"
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isUrlEntered && (
                      <button
                        type="button"
                        onClick={handleClearUrl}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-400 transition-colors p-1"
                        title="Clear URL"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-amber-300/80">
                    ⚠️ {language === 'hi' ? 'नोट: Google Drive लिंक का एक्सेस "Anyone with the link" (पब्लिक) होना चाहिए।' : 'Note: Google Drive links must be set to "Anyone with the link" (public access).'}
                  </p>

                  {/* Thumbnail test preview if valid image URL is loaded */}
                  {isUrlEntered && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-32 bg-black/60 p-2 flex items-center justify-center">
                      <img
                        src={externalUrl}
                        alt="URL Preview"
                        className="max-h-28 object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400">
            🔒 <strong>Privacy Assurance:</strong> Your student credentials and roll numbers are strictly encrypted and used ONLY for verifying genuine aspirant identity. We never share student details with third parties.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                onClose();
              }}
              className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCameraActive}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : isPending ? 'Update Verification Info' : 'Submit For Free Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



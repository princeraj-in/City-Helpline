import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadMultipleImages } from '../lib/storage';
import { Listing } from '../types';
import { UploadCloud, X, ArrowLeft, Tag, MapPin, Loader2, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, STATE_CITIES } from '../lib/constants';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { useLocationContext } from '../contexts/LocationContext';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { ListingSuccessModal } from '../components/common/ListingSuccessModal';

export default function AddListing() {
  const { currentUser, userProfile } = useAuth();
  const { userLocation } = useLocationContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PG');
  const [city, setCity] = useState(userLocation?.city || '');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Success Celebration Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdListing, setCreatedListing] = useState<{
    id: string;
    title: string;
    city: string;
    price: number;
    category: string;
    imageThumbnail?: string;
  } | null>(null);

  // Sync city if user location is detected
  useEffect(() => {
    if (userLocation?.city && !city) {
      setCity(userLocation.city);
    }
  }, [userLocation?.city]);

  const categoryOptions = CATEGORIES.map(cat => ({ value: cat, label: cat }));
  
  const cityOptions = Object.entries(STATE_CITIES).flatMap(([state, cities]) => 
    cities.map(c => ({ value: c, label: c, group: state }))
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      setImages(prev => [...prev, ...filesArray]);
      
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) {
      setError('User profile not found. Please log in again.');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    if (!city) {
      setError('Please select a city');
      return;
    }
    
    setLoading(true);
    setError('');
    setUploadProgressText('Optimizing & preparing photos...');

    try {
      // 1. Fast Concurrent Pre-compressed Upload
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        setUploadProgressText(`Compressing & uploading ${images.length} photos...`);
        uploadedImageUrls = await uploadMultipleImages(images, (completed, total) => {
          setUploadProgressText(`Uploaded ${completed} of ${total} photos...`);
        });
      }

      setUploadProgressText('Saving listing for verification...');

      // 2. Save listing to Firestore with status: 'pending'
      const newListing: Omit<Listing, 'id'> = {
        title: title.trim(),
        description: description.trim(),
        category,
        city,
        address: address.trim(),
        price: Number(price),
        contact: contact.trim(),
        images: uploadedImageUrls,
        status: 'pending', // Awaiting Admin Review
        featured: false,
        authorId: currentUser.uid,
        authorName: userProfile.name || currentUser.displayName || 'Studolink Host',
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, 'listings'), newListing);
      
      // 3. Open celebratory success modal
      setCreatedListing({
        id: docRef.id,
        title: title.trim(),
        city,
        price: Number(price),
        category,
        imageThumbnail: uploadedImageUrls[0] || undefined
      });
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error("Error adding listing:", err);
      setError(err.message || 'Failed to submit listing. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgressText('');
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setAddress('');
    setContact('');
    setImages([]);
    setImagePreviewUrls([]);
    setError('');
    setShowSuccessModal(false);
    setCreatedListing(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20 md:pb-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <PersonalPageHeader
          title="Add New Listing"
          subtitle="List student PG, hostel, silent library, or mess facility for free"
          badge="Host Portal"
          badgeColor="bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
          icon={Building2}
          iconColor="text-[#00E5FF]"
          exitUrl="/profile"
          backLabel="Profile"
        />

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-10 tracking-tight drop-shadow-sm">Add New Listing</h1>
            
            {error && (
              <div className="mb-10 bg-red-900/20 border border-red-800/50 text-red-200 px-6 py-4 rounded-2xl text-sm backdrop-blur-md shadow-inner flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 text-white rounded-2xl focus:ring-0 focus:border-[#00E5FF]/50 focus:bg-[rgba(255,255,255,0.08)] outline-none transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-lg font-light backdrop-blur-xl"
                    placeholder="e.g., Premium Boys PG near Allen"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="relative z-30">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</label>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-2xl border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] focus-within:bg-[rgba(255,255,255,0.08)] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300">
                    <SearchableSelect
                      options={categoryOptions}
                      value={category}
                      onChange={setCategory}
                      placeholder="Select Category"
                      icon={<Tag className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="relative z-20">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">City</label>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-2xl border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] focus-within:bg-[rgba(255,255,255,0.08)] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300">
                    <SearchableSelect
                      options={cityOptions}
                      value={city}
                      onChange={setCity}
                      placeholder="Select City"
                      icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Description</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-5 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 text-white rounded-2xl focus:ring-0 focus:border-[#00E5FF]/50 focus:bg-[rgba(255,255,255,0.08)] outline-none transition-all resize-none shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-lg font-light backdrop-blur-xl"
                    placeholder="Describe your listing in detail..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Full Address</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-5 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 text-white rounded-2xl focus:ring-0 focus:border-[#00E5FF]/50 focus:bg-[rgba(255,255,255,0.08)] outline-none transition-all resize-none shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-lg font-light backdrop-blur-xl"
                    placeholder="Enter complete address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Price (₹ per month)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-5 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 text-white rounded-2xl focus:ring-0 focus:border-[#00E5FF]/50 focus:bg-[rgba(255,255,255,0.08)] outline-none transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-lg font-light backdrop-blur-xl"
                    placeholder="e.g., 5000"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Number</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 text-white rounded-2xl focus:ring-0 focus:border-[#00E5FF]/50 focus:bg-[rgba(255,255,255,0.08)] outline-none transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-lg font-light backdrop-blur-xl"
                    placeholder="e.g., +91 9876543210"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Images</label>
                  <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-white/10 border-dashed rounded-3xl hover:bg-[rgba(255,255,255,0.05)] transition-colors bg-[rgba(255,255,255,0.02)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group cursor-pointer relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="space-y-3 text-center relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] mb-2 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.1)] border border-white/10 group-hover:border-[#00E5FF]/50">
                        <UploadCloud className="h-8 w-8 text-[#00E5FF]" />
                      </div>
                      <div className="flex text-sm text-gray-300 justify-center font-medium">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md text-[#00E5FF] hover:text-white focus-within:outline-none transition-colors"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {imagePreviewUrls.map((url, index) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={index} 
                          className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-square shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                        >
                          <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-[#0D0D0D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-[#FF3B3B]/90 backdrop-blur-sm text-white rounded-full p-3 transform hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,59,59,0.5)] border border-[#FF3B3B]/50"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Listings undergo verification within 12–24h before going public.</span>
                </p>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="px-6 py-3.5 rounded-2xl text-xs font-bold text-gray-400 hover:bg-white/[0.05] hover:text-white transition-all border border-transparent hover:border-white/10 uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] hover:from-[#8A2BE2] hover:to-[#00E5FF] text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-[0_5px_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none uppercase tracking-wider text-xs"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{uploadProgressText || 'Submitting...'}</span>
                      </>
                    ) : (
                      <span>Submit for Verification</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Premium Celebration & Verification Success Modal */}
      {createdListing && (
        <ListingSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/my-listings');
          }}
          type="accommodation"
          itemId={createdListing.id}
          itemTitle={createdListing.title}
          city={createdListing.city}
          price={createdListing.price}
          category={createdListing.category}
          imageThumbnail={createdListing.imageThumbnail}
          onAddAnother={handleResetForm}
        />
      )}
    </motion.div>
  );
}

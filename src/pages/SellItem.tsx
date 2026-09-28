import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadMultipleImages } from '../lib/storage';
import { MarketplaceCategory, ItemCondition, MarketplaceItem } from '../types';
import { MARKETPLACE_CATEGORIES, ITEM_CONDITIONS, STATE_CITIES } from '../lib/constants';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { ListingSuccessModal } from '../components/common/ListingSuccessModal';
import { 
  ShoppingBag, ArrowLeft, UploadCloud, X, AlertCircle, 
  CheckCircle, Sparkles, MapPin, Tag, IndianRupee, Phone, MessageCircle, Info, Gift, Heart, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SellItem() {
  const [searchParams] = useSearchParams();
  const isFreeParam = searchParams.get('type') === 'free';

  const { currentUser, userProfile } = useAuth();
  const { userLocation } = useLocationContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState(isFreeParam ? 'FREE: ' : '');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('Books & Notes');
  const [condition, setCondition] = useState<ItemCondition>('Good Condition');
  const [price, setPrice] = useState(isFreeParam ? '0' : '');
  const [originalPrice, setOriginalPrice] = useState('');
  const [city, setCity] = useState(userLocation?.city || 'Kota');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [whatsapp, setWhatsapp] = useState(userProfile?.phone || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Success Celebration Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdItem, setCreatedItem] = useState<{
    id: string;
    title: string;
    city: string;
    price: number;
    category: string;
    imageThumbnail?: string;
  } | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  useEffect(() => {
    if (userLocation?.city && !city) {
      setCity(userLocation.city);
    }
  }, [userLocation?.city]);

  const cityOptions = Object.entries(STATE_CITIES).flatMap(([state, cities]) => 
    cities.map(c => ({ value: c, label: c, group: state }))
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      if (imageFiles.length + files.length > 5) {
        setError('Maximum 5 photos allowed per listing.');
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
      const newUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addPresetUrl = (url: string) => {
    if (previewUrls.length >= 5) {
      setError('Maximum 5 photos allowed.');
      return;
    }
    setPreviewUrls(prev => [...prev, url]);
    setCustomImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please log in to list an item on the student marketplace.');
      return;
    }

    if (!title.trim() || !description.trim() || price.trim() === '' || !city || !phone) {
      setError('Please fill in all required fields.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please enter a valid selling price.');
      return;
    }

    const numOriginal = originalPrice ? Number(originalPrice) : undefined;
    if (numOriginal && numOriginal < numPrice) {
      setError('MRP / Original price should be higher than selling price.');
      return;
    }

    setLoading(true);
    setUploadProgressText('Optimizing & compressing photos...');

    try {
      // 1. Fast Concurrent Pre-compressed Upload
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploadProgressText(`Compressing & uploading ${imageFiles.length} photos...`);
        uploadedUrls = await uploadMultipleImages(imageFiles, (completed, total) => {
          setUploadProgressText(`Uploaded ${completed} of ${total} photos...`);
        });
      }

      setUploadProgressText('Publishing to campus marketplace...');

      // Combine uploaded file URLs with any direct image URLs added
      const nonBlobUrls = previewUrls.filter(u => !u.startsWith('blob:'));
      const finalImages = [...uploadedUrls, ...nonBlobUrls];

      if (finalImages.length === 0) {
        // Fallback realistic category image
        const categoryFallbacks: Record<string, string> = {
          'Books & Notes': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
          'Study Furniture': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          'Coolers & Fans': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
          'Cycles & Bikes': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
          'Electronics & Gadgets': 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
          'Mattress & Bedding': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
          'Other Essentials': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
        };
        finalImages.push(categoryFallbacks[category] || categoryFallbacks['Books & Notes']);
      }

      const itemPayload = {
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        ...(numOriginal ? { originalPrice: numOriginal } : {}),
        category,
        condition,
        city,
        ...(area.trim() ? { area: area.trim() } : {}),
        images: finalImages,
        sellerId: currentUser.uid,
        sellerName: userProfile?.name || currentUser.displayName || 'Student Seller',
        sellerPhone: phone.trim(),
        ...(whatsapp.trim() ? { whatsappNumber: whatsapp.trim() } : {}),
        status: 'available',
        createdAt: Date.now(),
        featured: false,
        isStudentVerified: !!userProfile?.isStudentVerified
      };

      const docRef = await addDoc(collection(db, 'marketplace_items'), itemPayload);

      setCreatedItem({
        id: docRef.id,
        title: title.trim(),
        city,
        price: numPrice,
        category,
        imageThumbnail: finalImages[0] || undefined
      });
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error('Error listing item:', err);
      setError(err.message || 'Failed to list item. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgressText('');
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setPrice(isFreeParam ? '0' : '');
    setOriginalPrice('');
    setArea('');
    setImageFiles([]);
    setPreviewUrls([]);
    setError(null);
    setShowSuccessModal(false);
    setCreatedItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-20 md:mb-16">
      <PersonalPageHeader
        title="Sell Student Item"
        subtitle="Sell books, cycle, cooler, study table or mattress directly to students"
        badge="Zero Commission"
        badgeColor="bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
        icon={ShoppingBag}
        iconColor="text-[#00E5FF]"
        exitUrl="/marketplace"
        backLabel="Marketplace"
      />

      <LiquidGlassCard className="p-6 sm:p-10 mb-8" glowColor="rgba(0, 229, 255, 0.25)">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center border border-[#00E5FF]/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Sell Student Item
            </h1>
            <p className="text-gray-300 text-sm">
              Sell your books, cycle, cooler, study table, or mattress directly to fellow students.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Item successfully listed! Redirecting to marketplace...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Title */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Allen NEET PCB Modules + HC Verma Physics (Set of 2)"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MarketplaceCategory)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF] transition-colors text-sm cursor-pointer"
              >
                {MARKETPLACE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Condition *
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ItemCondition)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF] transition-colors text-sm cursor-pointer"
              >
                {ITEM_CONDITIONS.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Original MRP / Purchase Price (₹) (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 4500 (shows discount %)"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Student Hub / City *
              </label>
              <SearchableSelect
                options={cityOptions}
                value={city}
                onChange={setCity}
                placeholder="Select city..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Local Area / Landmark / Colony
              </label>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Landmark City, Kunhari / Boring Rd"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1.5">
              Description & Details *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mention details: edition, months used, working condition, accessories included, and where the student can collect it..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm resize-none"
            />
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                Phone Number for Calls *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-200 mb-1.5">
                WhatsApp Number (Optional)
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="Defaults to phone number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1.5">
              Item Photos (Up to 5)
            </label>
            <div className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-400/40 transition-colors text-center relative bg-white/[0.02]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <UploadCloud className="w-10 h-10 text-[#00E5FF] mb-2" />
                <p className="text-sm font-bold text-white mb-1">
                  Click or drag photos here
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG or WEBP (Max 5MB each)
                </p>
              </div>
            </div>

            {/* Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Link
              to="/marketplace"
              className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 font-semibold text-sm transition-all"
            >
              Cancel
            </Link>
            <LiquidButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="px-8 py-3 font-bold text-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{uploadProgressText || 'Publishing Item...'}</span>
                </>
              ) : (
                <span>Post Listing on Marketplace</span>
              )}
            </LiquidButton>
          </div>
        </form>
      </LiquidGlassCard>

      {/* Premium Celebration & Success Modal for Marketplace Item */}
      {createdItem && (
        <ListingSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/marketplace');
          }}
          type="marketplace"
          itemId={createdItem.id}
          itemTitle={createdItem.title}
          city={createdItem.city}
          price={createdItem.price}
          category={createdItem.category}
          imageThumbnail={createdItem.imageThumbnail}
          onAddAnother={handleResetForm}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Waves, Plus, Edit3, X, Save, Trash2, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { DiveSite } from '../../../data/divingData';
import { DesignContentConfig } from '../../../types/admin';
import { DEFAULT_DESIGN_CONTENT } from '../../../data/defaultConfig';

interface SitesTabProps {
  sites: DiveSite[];
  initialDesign?: DesignContentConfig;
  onAddSite: (site: DiveSite) => void;
  onUpdateSite: (id: string, updates: Partial<DiveSite>) => void;
  onDeleteSite: (id: string) => void;
  onUpdateDesign?: (design: Partial<DesignContentConfig>) => void;
  showToast: (msg?: string) => void;
}

export const SitesTab: React.FC<SitesTabProps> = ({
  sites,
  initialDesign = DEFAULT_DESIGN_CONTENT,
  onAddSite,
  onUpdateSite,
  onDeleteSite,
  onUpdateDesign,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [editingSite, setEditingSite] = useState<DiveSite | null>(null);
  const [designForm, setDesignForm] = useState<DesignContentConfig>(initialDesign);
  const [showHeaderEditor, setShowHeaderEditor] = useState(false);

  useEffect(() => {
    if (initialDesign) setDesignForm(initialDesign);
  }, [initialDesign]);

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDesign?.(designForm);
    showToast(isRtl ? 'تم حفظ عنوان ومقدمة قسم مواقع الغوص!' : 'Sites header updated!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-400" />
            {isRtl ? 'مواقع وغوصات جدة البحرية والرحلات' : 'Jeddah Dive Destinations'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'إدارة وتعديل المواقع المعتمدة لرحلات وغوصات المركز في مياه جدة (شرم أبحر، أبو طير، المسماري، البويلر).'
              : 'Active dive sites off Jeddah waters managed by the center.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowHeaderEditor(!showHeaderEditor)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isRtl ? 'تعديل عنوان ومقدمة القسم' : 'Edit Section Header'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHeaderEditor ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              const newId = `site-${Date.now()}`;
              const emptySite: DiveSite = {
                id: newId,
                name: { ar: 'موقع غوص جديد بجدة', en: 'New Jeddah Dive Site' },
                location: { ar: 'شمال جدة - البحر الأحمر', en: 'North Jeddah - Red Sea' },
                depth: { ar: '10 - 30 متر', en: '10 - 30 meters' },
                level: { ar: 'جميع المستويات', en: 'All Levels' },
                visibility: { ar: '25 - 35 متر', en: '25 - 35 meters' },
                current: { ar: 'خفيف', en: 'Gentle' },
                marineLife: {
                  ar: ['شِعاب مرجانية', 'أسماك الببغاء', 'سلاحف بحرية'],
                  en: ['Coral Reefs', 'Parrotfish', 'Sea Turtles']
                },
                description: {
                  ar: 'وصف تفصيلي لموقع الغوص والحياة البحرية والعمق.',
                  en: 'Detailed description of the dive destination.'
                }
              };
              onAddSite(emptySite);
              setEditingSite(emptySite);
              showToast(isRtl ? 'تمت إضافة موقع جديد، يمكنك تعديله الآن' : 'New site added, edit details now');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة موقع غوص جديد' : 'Add New Site'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Section Header Editor */}
      {showHeaderEditor && (
        <form onSubmit={handleSaveHeader} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              <span>{isRtl ? 'تعديل عنوان ونصوص مقدمة قسم مواقع الغوص بجدة' : 'Sites Section Header Texts'}</span>
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isRtl ? 'حفظ النصوص' : 'Save Header'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالعربية):' : 'Kicker (Arabic):'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={designForm.sitesKickerAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, sitesKickerAr: e.target.value }))}
                placeholder="وجهات استثنائية · عروس البحر الأحمر"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالإنجليزية):' : 'Kicker (English):'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={designForm.sitesKickerEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, sitesKickerEn: e.target.value }))}
                placeholder="Premier Destinations · Jeddah Red Sea"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العنوان الرئيسي (بالعربية):' : 'Title (Arabic):'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={designForm.sitesTitleAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, sitesTitleAr: e.target.value }))}
                placeholder="أجمل مواقع الغوص وشِعاب جدة المرجانية"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العنوان الرئيسي (بالإنجليزية):' : 'Title (English):'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={designForm.sitesTitleEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, sitesTitleEn: e.target.value }))}
                placeholder="Iconic Jeddah Dive Sites & Coral Reefs"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الوصف التوضيحي (بالعربية):' : 'Description (Arabic):'}
              </label>
              <textarea
                dir="rtl"
                rows={2}
                value={designForm.sitesDescAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, sitesDescAr: e.target.value }))}
                placeholder="استكشف أشهر وجهات الغوص الترفيهي والاستكشافي وحطام السفن التاريخية في مياه جدة الساحرة."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 outline-none leading-relaxed"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الوصف التوضيحي (بالإنجليزية):' : 'Description (English):'}
              </label>
              <textarea
                dir="ltr"
                rows={2}
                value={designForm.sitesDescEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, sitesDescEn: e.target.value }))}
                placeholder="Explore the most celebrated diving spots, historic wrecks, and thriving coral plateaus in Jeddah."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 outline-none leading-relaxed"
              />
            </div>
          </div>
        </form>
      )}

      {/* Edit Site Inline Form */}
      {editingSite && (
        <div className="p-5 rounded-2xl bg-blue-950/20 border-2 border-blue-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-400" />
              <span>{isRtl ? 'تعديل بيانات موقع الغوص:' : 'Edit Dive Site:'}</span>
              <span className="text-blue-300 font-mono text-xs">{editingSite.name.ar}</span>
            </h4>
            <button
              type="button"
              onClick={() => setEditingSite(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'اسم الموقع (بالعربية):' : 'Site Name (Arabic):'}
              </label>
              <input
                type="text"
                value={editingSite.name.ar}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  name: { ...editingSite.name, ar: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الموقع الجغرافي:' : 'Location Area:'}
              </label>
              <input
                type="text"
                value={editingSite.location.ar}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  location: { ...editingSite.location, ar: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العمق:' : 'Depth Range:'}
              </label>
              <input
                type="text"
                value={editingSite.depth.ar}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  depth: { ...editingSite.depth, ar: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'مستوى الغواصين المطلوب:' : 'Required Diver Level:'}
              </label>
              <input
                type="text"
                value={editingSite.level.ar}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  level: { ...editingSite.level, ar: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isRtl ? 'وصف الموقع ومميزاته:' : 'Description & Features:'}
            </label>
            <textarea
              rows={2}
              value={editingSite.description.ar}
              onChange={(e) => setEditingSite({
                ...editingSite,
                description: { ...editingSite.description, ar: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onUpdateSite(editingSite.id, editingSite);
                setEditingSite(null);
                showToast(isRtl ? 'تم حفظ تعديلات الموقع بنجاح!' : 'Site updated successfully!');
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ تعديل الموقع' : 'Save Site'}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditingSite(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sites.map((site) => (
          <div key={site.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{site.name.ar}</h4>
                  <span className="text-xs text-blue-400 block mt-0.5">{site.location.ar}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                  {site.depth.ar}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                {site.description.ar}
              </p>

              <div className="pt-2 border-t border-slate-850 flex flex-wrap gap-1.5 mt-2">
                {site.marineLife.ar.slice(0, 4).map((animal, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                    {animal}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setEditingSite(site)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تعديل' : 'Edit'}</span>
              </button>
              {sites.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteSite(site.id);
                    if (editingSite?.id === site.id) setEditingSite(null);
                    showToast(isRtl ? 'تم حذف الموقع' : 'Site removed');
                  }}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                  title={isRtl ? 'حذف الموقع' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

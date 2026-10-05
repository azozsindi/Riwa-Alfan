import React, { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, ShieldCheck, Zap, AlertCircle, ArrowUpRight, HelpCircle, Server } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { CenterBrandConfig } from '../../../types/admin';

interface DomainTabProps {
  initialBrand: CenterBrandConfig;
  onUpdateBrand: (brand: Partial<CenterBrandConfig>) => void;
  showToast: (msg?: string) => void;
}

export const DomainTab: React.FC<DomainTabProps> = ({
  initialBrand,
  onUpdateBrand,
  showToast
}) => {
  const { isRtl } = useLanguage();
  const [domainName, setDomainName] = useState(initialBrand.customDomain || 'riwaalfan.com');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<'spaceship' | 'cloudflare' | 'godaddy' | 'namecheap' | 'forwarding'>('spaceship');

  const TARGET_HOST = 'ais-pre-qmhjfz2xry6g4myck4tmtr-138630195296.europe-west2.run.app';
  const TARGET_URL = 'https://ais-pre-qmhjfz2xry6g4myck4tmtr-138630195296.europe-west2.run.app';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(isRtl ? 'تم نسخ القيمة للحافظة!' : 'Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = domainName.replace(/https?:\/\//, '').replace(/\/$/, '').trim();
    setDomainName(cleanDomain);
    onUpdateBrand({ customDomain: cleanDomain });
    showToast(isRtl ? 'تم حفظ اسم الدومين بنجاح!' : 'Domain name saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#C59B5F]" />
          <h3 className="text-base font-bold text-white">
            {isRtl ? 'إعدادات وربط الدومين المخصص (riwaalfan.com)' : 'Custom Domain Linking (riwaalfan.com)'}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
            {isRtl ? 'دومين رسمي معتمد' : 'Verified Domain'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {isRtl 
            ? 'خطوات ربط النطاق الخاص بك (riwaalfan.com) بسيرفر المنصة المباشر وتفعيل شهادة الأمان SSL وحسابات الـ DNS.' 
            : 'Step-by-step DNS setup to link riwaalfan.com with full SSL and global edge routing.'}
        </p>
      </div>

      {/* Domain Input Form */}
      <form onSubmit={handleSaveDomain} className="p-5 rounded-2xl bg-slate-900 border border-[#C59B5F]/30 space-y-4 shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'اسم الدومين الذي قمت بشرائه:' : 'Your Purchased Domain Name:'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-500 text-xs">
                https://
              </span>
              <input 
                type="text" 
                value={domainName} 
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="riwaalfan.com"
                className="w-full ps-16 pe-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:border-[#C59B5F] outline-none font-mono font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
          >
            {isRtl ? 'حفظ وتحديث الدومين' : 'Save Domain'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isRtl 
              ? 'تم ضبط الروابط الدائمة (Canonical) وبطاقات التواصل الاجتماعي (OpenGraph) تلقائياً على هذا الدومين.' 
              : 'Canonical URLs, OpenGraph social cards, and sitemaps are automatically configured for this domain.'}
          </span>
        </div>
      </form>

      {/* Target Server & DNS Records Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {isRtl ? 'بيانات سجلات الـ DNS المطلوبة في لوحة تحكم الدومين' : 'Required DNS Records to add in your registrar'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Cloud Run Target</span>
        </div>

        {/* DNS Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'النوع (Type)' : 'Type'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'المضيف (Name / Host)' : 'Host'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'القيمة / الهدف (Target / Value)' : 'Target / Value'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'الـ TTL' : 'TTL'}</th>
                <th className="py-2.5 px-3 text-center">{isRtl ? 'نسخ' : 'Copy'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/60 font-mono">
              {/* Record 1: www */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold text-[11px] border border-blue-500/30">
                    CNAME
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-white">www</td>
                <td className="py-3 px-3 text-[#E0BA84] truncate max-w-[280px]" title={TARGET_HOST}>
                  {TARGET_HOST}
                </td>
                <td className="py-3 px-3 text-slate-400">Auto / 3600</td>
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleCopy(TARGET_HOST, 'cname-www')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#C59B5F] hover:text-slate-950 text-slate-300 transition-colors cursor-pointer inline-flex items-center gap-1"
                    title={isRtl ? 'نسخ القيمة' : 'Copy'}
                  >
                    {copiedKey === 'cname-www' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>

              {/* Record 2: Apex @ via Cloudflare / CNAME Flattening */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold text-[11px] border border-amber-500/30">
                    CNAME
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-white">@ (الدومين الرئيسي)</td>
                <td className="py-3 px-3 text-[#E0BA84] truncate max-w-[280px]" title={TARGET_HOST}>
                  {TARGET_HOST}
                </td>
                <td className="py-3 px-3 text-slate-400">Auto (Proxied)</td>
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleCopy(TARGET_HOST, 'cname-apex')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#C59B5F] hover:text-slate-950 text-slate-300 transition-colors cursor-pointer inline-flex items-center gap-1"
                    title={isRtl ? 'نسخ القيمة' : 'Copy'}
                  >
                    {copiedKey === 'cname-apex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrar Walkthrough Guides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {isRtl ? 'دليل الربط حسب الشركة التي اشتريت منها الدومين:' : 'Step-by-Step Registrar Guides:'}
          </span>
        </div>

        {/* Guide Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveGuide('spaceship')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeGuide === 'spaceship' 
                ? 'gold-gradient-btn text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚀</span>
            <span>Spaceship ({isRtl ? 'حسابك الحالي' : 'Your Registrar'})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveGuide('cloudflare')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeGuide === 'cloudflare' 
                ? 'gold-gradient-btn text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>☁️</span>
            <span>Cloudflare ({isRtl ? 'شهادة SSL مجانية' : 'Free SSL'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuide('godaddy')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeGuide === 'godaddy' 
                ? 'gold-gradient-btn text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌐</span>
            <span>GoDaddy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuide('forwarding')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeGuide === 'forwarding' 
                ? 'gold-gradient-btn text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚡</span>
            <span>{isRtl ? 'التحويل السريع (Forwarding)' : 'URL Redirect'}</span>
          </button>
        </div>

        {/* GUIDE CONTENT */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          {/* 1. SPACESHIP (YOUR REGISTRAR) */}
          {activeGuide === 'spaceship' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Zap className="w-4 h-4 text-[#C59B5F]" />
                <span>{isRtl ? 'طريقة ربط الدومين في منصة Spaceship (خطوة بخطوة):' : 'How to link your domain in Spaceship:'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-white font-bold block">{isRtl ? '⚡ الطريقة الأسهل والأسرع (Web Forwarding المباشر بـ Spaceship):' : 'Method 1: Spaceship Web Forwarding (Easiest)'}</span>
                <p className="text-slate-400">
                  {isRtl 
                    ? 'توفر منصة Spaceship تطبيقاً مدمجاً اسمه Web Forwarding يقوم بربط الدومين وتفعيل شهادة الأمان تلقائياً في دقيقة واحدة:' 
                    : 'Spaceship has a built-in Web Forwarding app in Launchpad:'}
                </p>
                <ol className="space-y-2 list-decimal list-inside text-slate-200 ps-1">
                  <li>{isRtl ? 'سجّل دخولك إلى حسابك في spaceship.com.' : 'Log in to spaceship.com.'}</li>
                  <li>{isRtl ? 'من القائمة الرئيسية (Launchpad)، اضغط على تطبيق "Web Forwarding".' : 'From the Launchpad, open the "Web Forwarding" app.'}</li>
                  <li>{isRtl ? 'اختر دومينك: riwaalfan.com' : 'Select your domain: riwaalfan.com.'}</li>
                  <li>
                    {isRtl ? 'في خانة الوجهة (Forward To / Destination)، ضع رابط المنصة المباشر:' : 'Set destination URL to:'}
                    <div className="mt-1 ps-4 font-mono text-xs text-[#C59B5F] flex items-center gap-2">
                      <span className="select-all">{TARGET_URL}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(TARGET_URL, 'spaceship-forward')}
                        className="p-1 rounded bg-slate-800 hover:bg-[#C59B5F] text-slate-300 hover:text-slate-950 transition-colors"
                      >
                        {copiedKey === 'spaceship-forward' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </li>
                  <li>{isRtl ? 'نوع التحويل: اختر 301 Permanent Redirect.' : 'Redirect type: 301 Permanent.'}</li>
                  <li>{isRtl ? 'تأكد من تفعيل "Include SSL" ثم اضغط "Save" أو "Connect".' : 'Enable SSL and click Save.'}</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-white font-bold block">{isRtl ? '🛠️ الطريقة الثانية (عبر Advanced DNS في Spaceship):' : 'Method 2: Spaceship Advanced DNS'}</span>
                <ol className="space-y-2 list-decimal list-inside text-slate-200 ps-1">
                  <li>{isRtl ? 'اذهب إلى Launchpad -> Domains -> واضغط على riwaalfan.com.' : 'Go to Launchpad -> Domains -> click riwaalfan.com.'}</li>
                  <li>{isRtl ? 'اختر تبويب "Advanced DNS" أو "DNS Records".' : 'Select Advanced DNS.'}</li>
                  <li>{isRtl ? 'اضغط "Add Record" وأضف السجل الأول:' : 'Click Add Record and enter:'}
                    <div className="mt-1 ps-4 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      Type: <strong className="text-blue-400">CNAME</strong> | Host: <strong className="text-white">www</strong> | Value: <strong className="text-[#C59B5F]">{TARGET_HOST}</strong>
                    </div>
                  </li>
                  <li>{isRtl ? 'اضغط "Add Record" وأضف السجل الثاني للدومين الرئيسي بدون www:' : 'Add record for apex domain:'}
                    <div className="mt-1 ps-4 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      Type: <strong className="text-amber-400">ALIAS</strong> | Host: <strong className="text-white">@</strong> | Value: <strong className="text-[#C59B5F]">{TARGET_HOST}</strong>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* 2. CLOUDFLARE */}
          {activeGuide === 'cloudflare' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>{isRtl ? 'لماذا Cloudflare هو الحل المثالي للدومين؟' : 'Why Cloudflare is the best free solution:'}</span>
              </div>
              <p className="text-xs text-slate-400">
                {isRtl 
                  ? 'منصة Cloudflare مجانية 100%، وتوفر شهادة أمان SSL تلقائية دون أي تكلفة، وتدعم خاصية CNAME Flattening التي تتيح ربط الدومين بدون www وبـ www معاً بسهولة وسرعة فائقة.' 
                  : 'Cloudflare provides 100% free automated SSL/TLS certificates, DDoS shielding, edge caching, and supports CNAME Flattening on apex domains.'}
              </p>

              <ol className="space-y-3 list-decimal list-inside text-slate-200">
                <li className="font-medium">
                  <strong>{isRtl ? 'سجّل في Cloudflare.com (مجاناً)' : 'Sign up at Cloudflare.com (Free)'}</strong>: {isRtl ? 'واضغط على "Add a Site" واكتب: riwaalfan.com' : 'Click "Add a Site" and type riwaalfan.com'}.
                </li>
                <li className="font-medium">
                  <strong>{isRtl ? 'اختر الخطة المجانية (Free Plan)' : 'Select the Free Plan'}</strong>.
                </li>
                <li className="font-medium">
                  <strong>{isRtl ? 'أضف سجلات الـ DNS' : 'Add DNS Records'}</strong>:
                  <div className="mt-2 ps-4 space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <strong>Record 1:</strong> Type: <span className="text-blue-400">CNAME</span> | Name: <span className="text-white">@</span> | Target: <span className="text-[#C59B5F]">{TARGET_HOST}</span> | Proxy: <span className="text-amber-400">Proxied 🟠</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <strong>Record 2:</strong> Type: <span className="text-blue-400">CNAME</span> | Name: <span className="text-white">www</span> | Target: <span className="text-[#C59B5F]">{TARGET_HOST}</span> | Proxy: <span className="text-amber-400">Proxied 🟠</span>
                    </div>
                  </div>
                </li>
                <li className="font-medium">
                  <strong>{isRtl ? 'تحديث الـ Nameservers' : 'Update Nameservers'}</strong>: {isRtl ? 'انسخ الـ Nameservers التي يعطيك إياها Cloudflare وضعها في مكان شراء الدومين (GoDaddy أو Namecheap أو غيرها).' : 'Copy the 2 nameservers provided by Cloudflare into your registrar.'}
                </li>
              </ol>
            </div>
          )}

          {/* 2. GODADDY */}
          {activeGuide === 'godaddy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">{isRtl ? 'طريقة الربط في GoDaddy:' : 'GoDaddy DNS Steps:'}</h4>
              <ol className="space-y-2 list-decimal list-inside text-slate-200">
                <li>{isRtl ? 'ادخل على حسابك في GoDaddy ثم توجه إلى "My Products" واضغط على دومين riwaalfan.com.' : 'Log in to GoDaddy, go to My Products, and click riwaalfan.com.'}</li>
                <li>{isRtl ? 'اضغط على تبويب "DNS" أو "Manage DNS".' : 'Click on the DNS or Manage DNS tab.'}</li>
                <li>{isRtl ? 'ابحث عن سجل CNAME باسم www، واضغط على "Edit" واجعل القيمة (Value):' : 'Find CNAME www, click Edit and set the value to:'}
                  <div className="mt-1 ps-4 font-mono text-xs text-[#C59B5F]">{TARGET_HOST}</div>
                </li>
                <li>
                  {isRtl ? 'لربط الدومين بدون www، توجّه إلى قسم "Forwarding" (إعادة التوجيه) في نفس صفحة GoDaddy واجعل الدومين يحول إلى https://www.riwaalfan.com أو الرابط المباشر.' : 'To forward the root domain, use GoDaddy Domain Forwarding to point to https://www.riwaalfan.com.'}
                </li>
              </ol>
            </div>
          )}

          {/* 3. NAMECHEAP */}
          {activeGuide === 'namecheap' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">{isRtl ? 'طريقة الربط في Namecheap:' : 'Namecheap DNS Steps:'}</h4>
              <ol className="space-y-2 list-decimal list-inside text-slate-200">
                <li>{isRtl ? 'سجل دخولك في Namecheap واذهب إلى "Domain List" ثم اضغط "Manage" بجانب riwaalfan.com.' : 'Log in to Namecheap, go to Domain List and click Manage.'}</li>
                <li>{isRtl ? 'اختر تبويب "Advanced DNS".' : 'Select the Advanced DNS tab.'}</li>
                <li>{isRtl ? 'اضغط "Add New Record" واختر النوع CNAME Record واكتب:' : 'Click Add New Record, select CNAME Record and enter:'}
                  <div className="mt-1 ps-4 font-mono text-xs space-y-1">
                    <div>Host: <span className="text-white">www</span> | Target: <span className="text-[#C59B5F]">{TARGET_HOST}</span> | TTL: <span className="text-slate-400">Automatic</span></div>
                  </div>
                </li>
                <li>
                  {isRtl ? 'في قسم "Domain" الأساسي، فعّل ميزة "Redirect Domain" لتحويل riwaalfan.com إلى https://www.riwaalfan.com.' : 'In the Domain tab, use Redirect Domain to forward root to https://www.riwaalfan.com.'}
                </li>
              </ol>
            </div>
          )}

          {/* 4. URL FORWARDING */}
          {activeGuide === 'forwarding' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">{isRtl ? 'خيار التحويل السريع المباشر (Domain Forwarding):' : 'Instant Domain Forwarding / Redirect:'}</h4>
              <p className="text-xs text-slate-400">
                {isRtl 
                  ? 'إذا كنت تريد أن يفتح الموقع فوراً وبأبسط طريقة بدون الدخول في تفاصيل الـ DNS المعقدة، يمكنك استخدام ميزة Domain Forwarding المتوفرة في أي شركة دومين:' 
                  : 'If you want the quickest way to make your domain open the app right away:'}
              </p>
              <ol className="space-y-2 list-decimal list-inside text-slate-200">
                <li>{isRtl ? 'ادخل على لوحة تحكم الدومين وابحث عن قسم "Forwarding" أو "إعادة توجيه الدومين".' : 'Look for Forwarding or Domain Redirect in your registrar.'}</li>
                <li>{isRtl ? 'ضع الرابط المباشر للوجهة:' : 'Set destination URL to:'}
                  <div className="mt-1 ps-4 font-mono text-xs text-[#C59B5F] select-all">{TARGET_URL}</div>
                </li>
                <li>{isRtl ? 'اختر نوع التحويل: 301 Permanent مع دعم SSL (HTTPS).' : 'Select 301 Permanent Redirect with SSL.'}</li>
              </ol>
            </div>
          )}

        </div>
      </div>

      {/* Online DNS Verification Tools */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-slate-300">
            {isRtl 
              ? 'هل قمت بضبط الـ DNS وتريد التأكد من انتشاره حول العالم؟' 
              : 'Want to check if your DNS propagation has completed worldwide?'}
          </span>
        </div>

        <a 
          href={`https://dnschecker.org/#CNAME/www.${domainName}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#E0BA84] hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span>{isRtl ? 'فحص انتشار الـ DNS عبر DNSChecker' : 'Check DNS Propagation'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};

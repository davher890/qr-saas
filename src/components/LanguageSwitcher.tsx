"use client"

import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    // { code: 'fr', name: 'Français', flag: '🇫🇷' },
    // { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export default function LanguageSwitcher() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = params.locale as string;

    const handleLanguageChange = (locale: string) => {
        router.replace(pathname, { locale });
    };

    return (
        <div className="relative inline-block">
            <select
                value={currentLocale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}


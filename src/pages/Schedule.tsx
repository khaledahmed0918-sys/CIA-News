import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TableProperties, Search, Loader2 } from 'lucide-react';
import Papa from 'papaparse';

interface TableRow {
  bn: string;
  dn: string;
  rank: string;
  adminRank: string;
  section: string;
  points: string;
  vp: string;
  citizenId: string;
  gameName: string;
}

export const Schedule: React.FC = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = "https://docs.google.com/spreadsheets/d/1baiVdBjuMjMsZVhM5Eh1VC0VI_Ex4N1RPfHTnktqvSc/export?format=csv&sheet=Central%20Intelligence%20Agency";
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const csvText = await response.text();
        
        // Parse CSV
        const result = Papa.parse<string[]>(csvText, { 
          skipEmptyLines: true 
        });
        
        const rows = result.data;
        let parsedData: TableRow[] = [];

        // Helper function to clean strange characters
        const cleanText = (str: string | undefined) => {
          if (!str) return '';
          // Remove the '￼' character and any other weird non-printable characters
          return str.replace(/￼/g, '').replace(/[\uFFFD\u200B]/g, '').trim();
        };

        rows.forEach((row, rowIndex) => {
          // Skip the first two rows (title and headers)
          if (rowIndex < 2) return;
          
          const bn = cleanText(row[0]);
          
          // Every time we see a new B.N, it's a new row. Skip if B.N is empty.
          if (!bn) return;
          
          // Skip the header row if it appears again
          if (bn === 'B.N') return;

          const dn = cleanText(row[1]);
          const rank = cleanText(row[2]);
          const adminRank = cleanText(row[3]);
          const section = cleanText(row[4]);
          const points = cleanText(row[6]);
          const vp = cleanText(row[7]);
          const citizenId = cleanText(row[14]);
          const gameName = cleanText(row[15]);

          parsedData.push({
            bn,
            dn,
            rank,
            adminRank,
            section,
            points,
            vp,
            citizenId,
            gameName
          });
        });

        setData(parsedData);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError('حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <TableProperties className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-100">الجدول</h2>
            <p className="text-blue-300/60 text-sm mt-1">سجل بيانات وكالة الاستخبارات المركزية</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400/50" />
          </div>
          <input
            type="text"
            placeholder="بحث في الجدول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-blue-100 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <GlassCard className="border border-white/10 shadow-2xl relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-blue-300/50 font-medium">جاري تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <TableProperties className="w-12 h-12 text-blue-400/30" />
            <p className="text-blue-300/50 font-medium">لا توجد بيانات لعرضها</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent" dir="ltr">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-900/20 border-b border-white/10">
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">B.N</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">D.N</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">RANK</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">Administrative Rank</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">Section</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">Points</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">V.P</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">Citizen ID</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold text-sm tracking-wider whitespace-nowrap">Game Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.bn || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.dn || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.rank || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.adminRank || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.section || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.points || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.vp || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.citizenId || '-'}
                    </td>
                    <td className="px-6 py-4 text-blue-100/80 text-sm whitespace-nowrap group-hover:text-blue-100 transition-colors align-middle">
                      {row.gameName || '-'}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-blue-300/50 whitespace-nowrap">
                      No matching results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

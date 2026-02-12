import type { Budget } from "@/types/trip";

function SectionTitle({ children, icon }: { children: React.ReactNode; icon: string }) {
  return (
    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <span>{icon}</span> {children}
    </h2>
  );
}

export function BudgetTab({ budget }: { budget: Budget }) {
  const entries = Object.entries(budget.perPerson);

  return (
    <div className="space-y-6">
      <SectionTitle icon={"\uD83D\uDCB0"}>Budget Breakdown</SectionTitle>

      {entries.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {entries.map(([key, item], i) => {
            const amount = typeof item.amount === "number"
              ? `${budget.currency === "JPY" ? "\u00A5" : ""}${item.amount.toLocaleString()}`
              : String(item.amount);
            const label = item.note || key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
            return (
              <div key={key} className={`px-4 py-2.5 flex items-center gap-3 ${i > 0 ? "border-t border-slate-100" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-800">{amount}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(budget.totalGroup || budget.totalPerPerson) && (
        <div className="bg-slate-800 text-white rounded-xl p-4">
          <div className="flex justify-between items-center">
            {budget.totalGroup && (
              <div>
                <p className="text-sm font-medium text-slate-300">Total</p>
                <p className="text-2xl font-bold">{budget.totalGroup}</p>
                {budget.totalGroupUSD && <p className="text-sm text-slate-400">{budget.totalGroupUSD}</p>}
              </div>
            )}
            {budget.totalPerPerson && (
              <div className="text-right">
                <p className="text-sm font-medium text-slate-300">Per Person</p>
                <p className="text-2xl font-bold">{budget.totalPerPerson}</p>
                {budget.totalPerPersonUSD && <p className="text-sm text-slate-400">{budget.totalPerPersonUSD}</p>}
              </div>
            )}
          </div>
          {budget.note && <p className="text-xs text-slate-400 mt-3">{budget.note}</p>}
        </div>
      )}
    </div>
  );
}

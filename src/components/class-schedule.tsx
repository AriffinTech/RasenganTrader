import { getClassesData } from "@/lib/sheets";

export default async function ClassSchedule() {
  const classes = await getClassesData();

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No class schedule available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {classes.map((item: { name: string, date: string, price: string, status: string }, index: number) => (
        <div key={index} className="border border-border/50 rounded-lg p-6 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-xl mb-2">{item.name}</h3>
          <p className="text-muted-foreground mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
            {item.date}
          </p>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50">
            <span className="font-bold text-lg">{item.price}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status.toLowerCase() === 'full' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

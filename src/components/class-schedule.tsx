import { getClassesData } from "@/lib/sheets";
import { EnrollmentLink } from "@/components/enrollment-link";

export default async function ClassSchedule() {
  const classes = await getClassesData();

  if (!classes || classes.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((item: { name: string, date: string, price: string, status: string }, index: number) => {
        const isCoaching = item.name.toLowerCase().includes("coaching");
        const offerType = isCoaching ? "coaching" : "course";
        const isFull = item.status.toLowerCase() === "full";
        
        // Use primary border for coaching, default border for others to match original design
        const borderClass = isCoaching ? "border-primary" : "border-border";

        return (
          <article key={index} className={`border ${borderClass} bg-secondary p-6 sm:p-8 relative overflow-hidden`}>
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                {item.status}
              </span>
            </div>

            <p className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
              {isCoaching ? "PERSONAL COACHING" : "CLASS OFFER"}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-foreground">{item.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">Next Session: {item.date}</p>
            
            <p className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.06em] text-foreground">
              {item.price}
            </p>
            
            {!isFull ? (
              <EnrollmentLink offer={offerType} variant={isCoaching ? "outline" : "solid"} className="mt-7 px-5 text-sm font-semibold">
                {isCoaching ? "Mohon Coaching" : "Daftar Kelas"}
              </EnrollmentLink>
            ) : (
              <button disabled className="mt-7 px-5 text-sm font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors h-10 bg-muted text-muted-foreground cursor-not-allowed">
                Penuh (Sold Out)
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

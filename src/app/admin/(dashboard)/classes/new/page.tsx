import { getCourses } from '@/lib/db/courses'
import { ClassSessionForm } from '@/components/admin/class-session-form'

export default async function NewClassSessionPage() {
  const courses = await getCourses()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground">
          Jadualkan Sesi Kelas Baru
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih kursus induk, tentukan tarikh intake, yuran, dan pautan Telegram group peserta.
        </p>
      </div>

      <ClassSessionForm courses={courses} />
    </div>
  )
}

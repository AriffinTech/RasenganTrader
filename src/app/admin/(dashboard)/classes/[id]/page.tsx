import { notFound } from 'next/navigation'
import { getCourses, getClassSessionById } from '@/lib/db/courses'
import { ClassSessionForm } from '@/components/admin/class-session-form'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditClassSessionPage({ params }: Props) {
  const { id } = await params
  const [courses, session] = await Promise.all([
    getCourses(),
    getClassSessionById(id),
  ])

  if (!session) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground">
          Kemaskini Sesi Kelas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ubah tarikh, harga yuran, status ketersediaan, atau pautan Telegram untuk sesi ini.
        </p>
      </div>

      <ClassSessionForm courses={courses} session={session} />
    </div>
  )
}

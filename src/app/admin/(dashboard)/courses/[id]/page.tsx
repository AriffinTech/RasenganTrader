import { notFound } from 'next/navigation'
import { getCourses } from '@/lib/db/courses'
import { CourseEditorForm } from '@/components/admin/course-editor-form'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === id || c.slug === id)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground">
          Kemaskini Kursus &amp; Silibus: {course.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ubah kandungan pengajian, senarai bonus biasa, dan kotak sorotan Exclusive Bonus.
        </p>
      </div>

      <CourseEditorForm course={course} />
    </div>
  )
}

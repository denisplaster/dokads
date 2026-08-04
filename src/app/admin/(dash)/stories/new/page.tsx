import { StoryForm } from '@/components/admin/StoryForm'

export const dynamic = 'force-dynamic'

export default function NewStory() {
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>New story</h1>
          <p>Saves as a draft until you publish it.</p>
        </div>
      </div>
      <div className="adm-card">
        <StoryForm />
      </div>
    </>
  )
}

import { useState, useEffect, useRef } from 'react'

interface Author {
  username: string
}

interface Story {
  id: number
  title: string
  genre: string
  illustration_style: string
  target_age: string
  author: Author
  content: string
}

function StoryListingPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [newStory, setNewStory] = useState<{ title: string; content: string }>({ title: '', content: '' })
  const addStoryModalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    fetchStories()
  }, [])

  async function fetchStories() {
    try {
      const response = await fetch('http://127.0.0.1:8000/stories')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu')
      console.error('Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleViewStory(story: Story) {
    setSelectedStory(story)
    const modal = document.getElementById('story-modal') as HTMLDialogElement | null
    if (modal) modal.showModal()
  }

  function handleAddStory() {
    if (addStoryModalRef.current) {
      addStoryModalRef.current.showModal()
    }
  }

  function handleModalClose() {
    if (addStoryModalRef.current) {
      addStoryModalRef.current.close()
    }
    setNewStory({ title: '', content: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Add your API call to submit the new story here
    console.log('New Story:', newStory)
    handleModalClose()
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Hikaye Listesi</h1>
      <div className="flex justify-center mb-8">
        <button className="btn btn-primary btn-lg" onClick={handleAddStory}>
          Hikaye Ekle
        </button>
      </div>
      {stories.length === 0 ? (
        <NoStoriesMessage />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} onView={handleViewStory} />
          ))}
        </div>
      )}
      <StoryModal story={selectedStory} />
      <AddStoryModal
        ref={addStoryModalRef}
        newStory={newStory}
        setNewStory={setNewStory}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{message}</span>
      </div>
    </div>
  )
}

function NoStoriesMessage() {
  return <div className="text-center text-lg mt-8">Henüz hikaye bulunmamaktadır.</div>
}

function StoryCard({ story, onView }: { story: Story; onView: (story: Story) => void }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        <h2 className="card-title">{story.title}</h2>
        <p><span className="font-semibold">Yazar:</span> {story.author.username}</p>
        <p><span className="font-semibold">Tür:</span> {story.genre}</p>
        <p><span className="font-semibold">İllüstrasyon Stili:</span> {story.illustration_style}</p>
        <p><span className="font-semibold">Hedef Yaş:</span> {story.target_age}</p>
        <div className="card-actions justify-end mt-4 space-x-2">
          <button className="btn btn-primary" onClick={() => onView(story)}>
            Görüntüle
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = `/story/${story.id}`}>
            Hikayeyi Oku
          </button>
        </div>
      </div>
    </div>
  )
}

function StoryModal({ story }: { story: Story | null }) {
  if (!story) return null

  return (
    <dialog id="story-modal" className="modal">
      <div className="modal-box w-11/12 max-w-7xl">
        <h3 className="font-bold text-2xl mb-4">{story.title}</h3>
        <div className="prose max-w-none">
          {story.content}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Kapat</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

import { forwardRef } from 'react'

const AddStoryModal = forwardRef<HTMLDialogElement, {
  newStory: { title: string; content: string }
  setNewStory: React.Dispatch<React.SetStateAction<{ title: string; content: string }>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}>(({ newStory, setNewStory, onClose, onSubmit }, ref) => {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-lg">Yeni Hikaye Ekle</h3>
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Hikaye Başlığı</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Hikaye İçeriği</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={newStory.content}
              onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
              required
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Ekle</button>
            <button type="button" className="btn" onClick={onClose}>Kapat</button>
          </div>
        </form>
      </div>
    </dialog>
  )
})

AddStoryModal.displayName = 'AddStoryModal'

export default StoryListingPage
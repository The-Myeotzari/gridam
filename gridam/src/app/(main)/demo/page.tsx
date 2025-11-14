import DropBox from '@/components/ui/dropbox'

export default async function Page() {
  async function deletePostAction() {
    'use server'
    // 삭제
  }

  async function editPostAction() {
    'use server'
    // 편집 진입/초기화 등
  }

  return (
    <>
      <DropBox id={'test'} onDelete={deletePostAction} onEdit={editPostAction} />
    </>
  )
}

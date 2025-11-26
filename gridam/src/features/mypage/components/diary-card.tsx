'use client'

import { Card, CardBody, CardHeader } from "@/shared/ui/card";
import { RecentDiary } from "../types/mypage";
import Image from "next/image";
import DropBox from "@/shared/ui/dropbox";
import { useRouter } from "next/navigation";
import { modalStore } from "@/store/modal-store";
import { ModalBody, ModalFooter, ModalHeader } from "@/shared/ui/modal/modal";
import Button from "@/shared/ui/button";
import { MESSAGES } from "@/shared/constants/messages";
import { deleteDiary } from "@/app/(main)/action";

interface DiaryCardProps {
  diary: RecentDiary
}

export default function DiaryCard({ diary }: DiaryCardProps) {
  const router = useRouter()

  const handleEdit = (id: string) => {
    // 다이어리 수정 페이지 이동
    router.push(`/${id}`)
  }

  const handleDelete = async (id: string) => {
    const res = await deleteDiary(id)
    if (res.ok) {
      router.refresh()
    }
  }

  const openDeleteModal = () => modalStore.open((close) => (
    <>
      <ModalHeader
        align="horizontal"
        cardTitle='정말 삭제할까요?'
      />

      <ModalBody className="p-6 text-slate-600">
        삭제 후에는 되돌릴 수 없습니다.
        <br />
        해당 그림일기를 삭제하시겠습니까?
      </ModalBody>

      <ModalFooter className="p-4 flex justify-end gap-2">
        <span onClick={close}>
          <Button label={MESSAGES.COMMON.CANCEL_BUTTON} />
        </span>

        <span
          onClick={async () => {
            close()
            await handleDelete(diary.id)
          }}
        >
          <Button
            type="submit"
            label={MESSAGES.COMMON.DELETE_BUTTON}
            className="bg-(--color-background) text-destructive border-destructive hover:bg-destructive hover:text-(--color-destructive-foreground)"
          />
        </span>
      </ModalFooter>
    </>
  ))

  return (
    <Card
      key={diary.id}
      hoverable
      indent="sm"
      className="shadow-none"
    >
      <CardHeader
        align="horizontal"
        cardImage={
          <div className='p-1 rounded-full bg-primary/20'>
            <Image src={diary.emoji} alt='날씨' width={40} height={40} />
          </div>
        }
        cardTitle={<span className='text-sm sm:text-base'>{diary.date}</span>}
        cardDescription={<span className='text-sm sm:text-base'>{diary.weekday}</span>}
        right={<DropBox
          id={diary.id}
          onEdit={() => handleEdit(diary.id)}
          onDelete={openDeleteModal}
        />}
        iconSize="sm"
      />
      <CardBody className="flex flex-col gap-1 pt-1">
        <p className="text-sm sm:text-base truncate">{diary.content}</p>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {diary.time}
        </span>
      </CardBody>
    </Card>
  )
}
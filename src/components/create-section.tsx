'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useCompletion } from 'ai/react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import BioCard from './bio-card'

const DEFAULT_ERROR_MSG = '生成失败，请稍后重试'
const handlerError = (error: Error | undefined) => {
  if (!error) {
    return
  }

  console.error(error)

  try {
    const errorData = JSON.parse(error.message)
    toast.error(errorData.error || DEFAULT_ERROR_MSG)
  } catch (e) {
    toast.error(DEFAULT_ERROR_MSG)
  }
}

export default function CreateSection() {
  const {
    error,
    isLoading,
    completion,
    input,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/generate-bio',
  })

  useEffect(() => handlerError(error), [error])

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center flex-col gap-3 sm:flex-row"
      >
        <Input
          type="text"
          name="merit"
          className="h-12"
          autoComplete="off"
          placeholder="例如：95 后程序员，现居深圳，热爱编程"
          value={input}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          className="w-full min-w-32 sm:w-auto h-12"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          生成{isLoading ? '中...' : ''}
        </Button>
      </form>
      {completion && (
        <div className="mt-8 flex justify-around">
          <BioCard
            className="w-full border-primary"
            bio={{ title: '专属介绍', content: completion.trim() }}
            canCopy
          />
        </div>
      )}
    </>
  )
}

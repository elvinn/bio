import Footer from '@/components/footer'
import CreateSection from '@/components/create-section'
import BioCard from '@/components/bio-card'
import { bios } from '@/lib/consts'
import Social from '@/components/social'

export default function Home() {
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <header className="flex justify-between items-center w-full mt-3 border-b-2 pb-4 sm:px-4 px-2">
        <h1 className="sm:text-2xl text-xl font-bold text-primary">
          Bio 生成器
        </h1>
        <Social />
      </header>

      <main className="flex flex-1 w-full flex-col items-center justify-center px-4 mt-8 sm:mt-4">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          已生成<b>上百次</b>
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-center text-primary !leading-tight">
          使用 AI 生成
          <br />
          你的个人专属介绍
        </h1>

        <div className="max-w-xl w-full my-12">
          <CreateSection />
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {bios.map((bio, index) => (
            // 小屏幕全屏，大屏幕一行两个
            <BioCard className="w-full sm:w-2/5" key={index} bio={bio} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

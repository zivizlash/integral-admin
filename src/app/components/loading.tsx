export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <p className="fixed text-2xl left-0 top-0 flex w-full justify-center border-b 
        border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 
        dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 
        lg:p-4 lg:dark:bg-zinc-800/30">
        Загрузка...
      </p>
    </div>
  )
}

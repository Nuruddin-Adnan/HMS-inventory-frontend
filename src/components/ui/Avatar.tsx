export default function Avatar({ name }: { name: string }) {

    return (
        <div className='ring-[#F4F4F5] ring-2 ring-offset-2 rounded-md flex items-center'>
            <div className="h-7 w-7 bg-[#FF0000] bg-opacity-[.12] font-bold text-sm text-[#FF0000] rounded-full  flex items-center justify-center">
                {name}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5 flex-none text-zinc-400"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path></svg>
        </div>
    );
}

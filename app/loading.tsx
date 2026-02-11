

// export default function Loading() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
//       <div className="relative flex items-center justify-center">
//         <div className="h-20 w-20 animate-spin rounded-full border-4 border-zinc-800 border-t-indigo-500"></div>

//         <span className="absolute text-xs font-medium tracking-widest text-zinc-400">
//           LOADING
//         </span>
//       </div>
//     </div>
//   );
// }
import HomeSkeleton from "@/components/HomeSkeleton";

export default function Loading() {
  return <HomeSkeleton />;
}


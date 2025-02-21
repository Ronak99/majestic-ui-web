import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { IconBrandGithub, IconPlugConnected } from "@tabler/icons-react";

export default function NoUserView() {
  const { signIn } = useAuthStore();
  return (
    <>
      <div className="mt-8 border rounded-xl p-4">
        <div className="flex flex-row items-center">
          <IconBrandGithub />
          <div className="flex flex-col ml-4 flex-grow">
            <p className="text-white font-semibold text-md">
              Import Git Repository
            </p>
            <p className="text-muted-foreground text-sm">
              Import a Flutter package.
            </p>
          </div>
          <Button onClick={signIn}>
            <IconPlugConnected />
            <span className="font-semibold">Connect</span>
          </Button>
        </div>
      </div>

      <iframe
        width="100%"
        height="315"
        className="mt-4 border rounded-3xl"
        src="https://www.youtube.com/embed/oiiAZcGAeNE?si=fdz9s_DQwaijhIvL"
        title="YouTube video player"
        // @ts-ignore
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        allowFullScreen={true}
      />
    </>
  );
}

"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import type EditorJS from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { usePathname, useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";

import { uploadFiles } from "@/lib/uploadthing";
import { PostCreationRequest, postValidator } from "@/lib/validators/post";

interface EditorProps {
  subconvoId: string;
}

const Editor: FC<EditorProps> = ({ subconvoId }) => {
  const ref = useRef<EditorJS | null | undefined>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // enforce type safety on form with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(postValidator),
    defaultValues: {
      subconvoId,
      title: "",
      content: null,
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Write your post here...",
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          table: Table,
          inlineCode: InlineCode,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    // if we're on the client, initialize the editor
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong!",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        // set focus to the title of the editor
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();
    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subconvoId,
    };
    createPost(payload);
  }

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content, subconvoId }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        subconvoId,
      };
      const { data } = await axios.post("/api/subconvo/post/create", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong!",
        description: "Your post could not be created. Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPath = pathname.split("/").slice(0, -1).join("/");
      router.push(newPath);

      router.refresh();

      return toast({
        description: "Your post has been created!",
        variant: "default",
      });
    },
  });

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form
        id="subconvo-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;

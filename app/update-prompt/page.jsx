"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

const UpdatePrompt = ({ promptData }) => {
  const router = useRouter();
  const [post, setPost] = useState({
    prompt: promptData?.prompt || "",
    tag: promptData?.tag || "",
  });
  const [submitting, setIsSubmitting] = useState(false);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const promptId = promptData?._id; // Assuming promptData has _id

    if (!promptId) {
      alert("Missing PromptId!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.log("Failed to update prompt");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompt/${id}`);
    const promptData = await res.json();

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    return {
      props: { promptData },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}

export default UpdatePrompt;

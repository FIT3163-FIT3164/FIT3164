import React from "react";

const ProjectDescription: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-transparent py-10 px-4"> {/* Changed background to transparent */}
      <div className="container max-w-3xl text-center bg-white bg-opacity-40 p-6 rounded-lg shadow-md"> {/* Added white background with opacity */}
        <h1 className="text-4xl font-bold mb-6 text-blue-600">
          Real-Time Sign Language Recognition Project
        </h1>
        <p className="text-lg leading-relaxed text-gray-700 mb-8">
          Communication is a fundamental human right, yet the deaf and
          hard-of-hearing community often faces substantial barriers in their
          daily interactions with non-signers, both in physical and digital
          spaces. These obstacles significantly impact their access to
          education, employment, and social inclusion. Sign language, a visual
          form of communication used by an estimated 70 million people worldwide
          (United Nations, n.d.), often relies on human interpreters to bridge
          the communication gap. However, despite advancements in sign language
          recognition (SLR) technology, many systems struggle in real-world
          scenarios, limiting their practical effectiveness.
        </p>
        <p className="text-lg leading-relaxed text-gray-700 mb-8">
          Our project seeks to address this challenge by developing an
          innovative solution: a proof-of-concept web application for real-time
          sign language transcription. The application will use either a
          standard webcam or an Intel RealSense camera, targeting a predictive
          accuracy of at least 80%. Our team consists of three dedicated
          members—Muhammad Fawwad Ali Khurram, Yap Jiun Cheng, and Manthi
          Subasinghe—under the supervision of Dr. Lim Mei Kuan.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          To achieve this, we are leveraging the Vision Transformer (ViT) model
          from Hugging Face, a cutting-edge machine learning model that has
          shown great promise in visual recognition tasks.
        </p>
      </div>
    </section>
  );
};

export default ProjectDescription;

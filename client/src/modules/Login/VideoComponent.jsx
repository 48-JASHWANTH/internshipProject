import React from "react";
import bgVideo from "./WebsiteHeroVideo.mp4";

const VideoComponent = () => {
  return (
    <div>
      <div className="background-video">
        <video src={bgVideo} autoPlay loop muted class="w-full h-[100vh] object-cover"></video>
      </div>
    </div>
  );
};

export default VideoComponent;

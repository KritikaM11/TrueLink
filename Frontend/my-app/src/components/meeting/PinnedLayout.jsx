import React from 'react';
import VideoCard from './VideoCard';

export const PinnedLayout = ({ pinnedId, pinnedVideo, localVideoTile, videos, screen, handlePin }) => {
    return (
        <div className="video-layout-pinned">
            <div className="pinned-main-area">
                {pinnedId === "local" ? (
                    localVideoTile
                ) : (
                    pinnedVideo && (
                        <VideoCard
                            stream={pinnedVideo.stream}
                            socketId={pinnedVideo.socketId}
                            username={pinnedVideo.username}
                            isMuted={pinnedVideo.isMuted}
                            isVideoOff={pinnedVideo.isVideoOff}
                            isPinnedArea={true}
                            isScreen={screen}
                            onPin={(e) => handlePin(pinnedId, e)}
                        />
                    )
                )}
            </div>
            <div className="pinned-sidebar">
                {pinnedId !== "local" && localVideoTile}
                {videos
                    .filter((v) => v.socketId !== pinnedId)
                    .map((v) => (
                        <VideoCard
                            key={v.socketId}
                            stream={v.stream}
                            socketId={v.socketId}
                            username={v.username}
                            isMuted={v.isMuted}
                            isVideoOff={v.isVideoOff}
                            isPinnedArea={false}
                            onPin={(e) => handlePin(v.socketId, e)}
                        />
                    ))}
            </div>
        </div>
    );
};
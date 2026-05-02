import React from 'react';
import VideoCard from './VideoCard';

export const OneOnOneLayout = ({ remoteVideo, localVideoTile, handlePin }) => {
    return (
        <div className="video-layout-1on1">
            <div className="onetoone-main">
                <VideoCard
                    stream={remoteVideo.stream}
                    socketId={remoteVideo.socketId}
                    username={remoteVideo.username}
                    isMuted={remoteVideo.isMuted}
                    isVideoOff={remoteVideo.isVideoOff}
                    isPinnedArea={false}
                    onPin={(e) => handlePin(remoteVideo.socketId, e)}
                />
            </div>
            <div className="onetoone-floating">
                {localVideoTile}
            </div>
        </div>
    );
};
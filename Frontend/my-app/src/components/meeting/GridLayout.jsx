import React from 'react';
import VideoCard from './VideoCard';

export const GridLayout = ({ pageTiles, localVideoTile, cols, rows, handlePin }) => {
    return (
        <div
            className="video-grid"
            style={{
                "--cols": cols,
                "--rows": rows,
            }}
        >
            {pageTiles.map((p) =>
                p.isLocal ? (
                    // Use React.cloneElement to keep the same element reference for the local camera
                    React.cloneElement(localVideoTile, { key: "local" })
                ) : (
                    <VideoCard
                        key={p.id}
                        stream={p.stream}
                        socketId={p.socketId}
                        username={p.username}
                        isMuted={p.isMuted}
                        isVideoOff={p.isVideoOff}
                        isPinnedArea={false}
                        onPin={(e) => handlePin(p.socketId, e)}
                    />
                )
            )}
        </div>
    );
};
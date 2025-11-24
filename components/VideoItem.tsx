
import React from 'react';
import type { Video } from '../types';

interface VideoItemProps {
    video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
    return (
        <div className="flex items-center justify-between p-4 border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="flex-grow pr-4">
                <h3 className="text-base text-etep-blue font-medium">{video.nome}</h3>
            </div>
            <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-block px-5 py-2 bg-etep-orange text-white text-sm font-bold rounded-full hover:bg-etep-orange-dark transition-colors whitespace-nowrap"
            >
                Acessar
            </a>
        </div>
    );
};

export default VideoItem;

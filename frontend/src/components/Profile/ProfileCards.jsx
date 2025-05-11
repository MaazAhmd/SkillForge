import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "../../api/axios";
import ProjectCard from "./ProjectCard";

export default function ProfileCards({ activeTab }) {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [convos, setConvos] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingConvos, setLoadingConvos] = useState(true);

    useEffect(() => {
        axios
            .get("/portfolio")
            .then((res) => setProjects(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoadingProjects(false));

        axios
            .get("/chat/conversations")
            .then(({ data }) => setConvos(data.data))
            .catch((err) => console.error(err))
            .finally(() => setLoadingConvos(false));
    }, []);

    if (!user) return null;

    const getPreviewText = (c) => {
        const lm = c.lastMessage;
        if (!lm) return "No messages yet";
        if (lm.content && lm.content.trim() !== "") return lm.content;
        if (lm.attachment) {
            return lm.sender === user._id
                ? "You sent an attachment"
                : `${c.participant.name} sent an attachment`;
        }
        return "No messages yet";
    };

    const Overview = (
        <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            style={{ width: "80%", margin: "auto" }}
        >
            {/* Profile Info */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Profile Information
                </h2>
                <p className="text-gray-600 mb-6">{user.bio.about}</p>
                <div className="space-y-4 text-gray-700">
                    <div>
                        <label className="block text-sm text-gray-500">
                            Full Name:
                        </label>
                        <p>{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Mobile:
                        </label>
                        <p>{user.bio.phone || "—"}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Email:
                        </label>
                        <p>{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Location:
                        </label>
                        <p>{user.bio.location || "—"}</p>
                    </div>
                </div>
            </div>

            {/* Conversations */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <div className="space-y-4">
                    {loadingConvos ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
                        </div>
                    ) : convos.length === 0 ? (
                        <p className="text-gray-500">
                            No recent conversations.
                        </p>
                    ) : (
                        convos.map((c) => (
                            <div
                                key={c.chatId}
                                className="flex items-start justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={
                                            c.participant.avatar ||
                                            "/images/default-avatar.png"
                                        }
                                        alt={c.participant.name}
                                        className="w-14 h-14 rounded-2xl object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium">
                                            {c.participant.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate max-w-xs">
                                            {getPreviewText(c)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="bg-primary text-white px-3 py-1 rounded-full font-semibold text-sm hover:bg-primary/90 transition hover:cursor-pointer"
                                    onClick={() =>
                                        navigate(`/chat/${c.chatId}`)
                                    }
                                >
                                    Chat
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // --- PROJECTS VIEW ---
    const Projects = (
        <div
            className="mt-8 p-6 bg-white rounded-lg shadow"
            style={{ width: "70%", margin: "auto" }}
        >
            <h2 className="text-lg font-semibold mb-4 text-center">Projects</h2>
            {loadingProjects ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
                </div>
            ) : projects.length <= 0 ? (
                <div className="flex justify-center py-8">
                    No Projects found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {projects.map((proj) => (
                        <ProjectCard key={proj._id} project={proj} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <main className="mx-auto px-4 py-8">
            {activeTab === "OVERVIEW" ? Overview : Projects}
        </main>
    );
}

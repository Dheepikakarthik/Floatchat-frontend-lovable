import { motion } from "framer-motion";

type Conversation = {
  id: string;
  title: string;
};

type Props = {
  recentConversations: Conversation[];
  navigate: any;
};

export default function RecentConversations({
  recentConversations,
  navigate,
}: Props) {
  return (
    <div className="mt-8 glass rounded-2xl p-6">
      <h2 className="mb-4 text-xl font-semibold">
        🕒 Recent Conversations
      </h2>

      <div className="space-y-3">
        {recentConversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            whileHover={{ scale: 1.02 }}
            onClick={() =>
              navigate({
                to: "/chat",
                search: {
                  conversationId: conversation.id,
                },
              })
            }
            className="cursor-pointer rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
          >
            {conversation.title}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
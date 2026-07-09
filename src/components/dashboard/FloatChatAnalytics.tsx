import CountUp from "react-countup";

type Props = {
  conversationCount: number;
  messageCount: number;
  oceanQueryCount: number;
};

export default function FloatChatAnalytics({
  conversationCount,
  messageCount,
  oceanQueryCount,
}: Props) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">
        🤖 FloatChat Analytics
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-muted-foreground">
            Conversations
          </div>

          <div className="mt-2 text-3xl font-bold">
            <CountUp
            end={conversationCount}
            duration={2}
/>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-muted-foreground">
            Messages
          </div>

          <div className="mt-2 text-3xl font-bold">
            <CountUp
            end={messageCount}
            duration={2}
/>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-muted-foreground">
            Ocean Queries
          </div>

          <div className="mt-2 text-3xl font-bold">
            <CountUp
            end={oceanQueryCount}
            duration={2}
/>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-muted-foreground">
            Status
          </div>

          <div className="mt-2 text-3xl font-bold text-green-400">
            Online
          </div>
        </div>

      </div>
    </div>
  );
}
import { Container } from "@/components/container/container-page";

export default function CartLoading() {
  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 p-4 border border-border rounded-xl bg-card"
            >
              <div className="w-24 h-24 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded" />
                <div className="h-10 w-32 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

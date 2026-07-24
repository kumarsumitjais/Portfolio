export default function BlogPage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-display font-bold mb-6 text-text-primary">Blog</h1>
      <p className="text-xl text-text-secondary max-w-2xl bg-bg-elevated border border-border-card p-8 rounded-2xl">
        I am currently working on writing articles about my experiences in data science, machine learning, and AI. 
        <br/><br/>
        <span className="text-electric-blue-500 font-medium">Stay tuned!</span>
      </p>
    </main>
  );
}

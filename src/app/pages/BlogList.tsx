import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Search, ArrowRight, BookOpen, TrendingUp, Clock,
  Calendar, Star, Sparkles, Tag, Mail,
  ChevronRight, Eye, Heart, Flame, Zap,
  Boxes, IndianRupee, Lightbulb, ShoppingBag, Leaf,
  BarChart3, Smartphone, Users
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { BlogCard } from '../components/blog/BlogCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Footer } from '../components/layout/Footer';

// ────────────────────────────────────────
// Hero with Featured Article
// ────────────────────────────────────────

function BlogHero({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (v: string) => void }) {
  const featured = BLOG_POSTS[0];

  return (
    <section className="relative pt-8 pb-20 bg-gradient-to-b from-[#082032] to-[#0F4C81] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-white/3 rounded-full blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 text-xs font-medium uppercase tracking-widest mb-8"
          >
            <BookOpen size={14} />
            Arali Learning Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter text-white leading-[0.95] mb-6"
          >
            Learn. Grow.<br />
            <span className="text-white/40">Sell smarter.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/40 font-light max-w-xl mx-auto mb-10"
          >
            Expert advice, industry trends, and practical tips to help you run a more profitable shop.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-lg mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-5 h-14 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-white/30 text-base transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Featured Article Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <Link to={`/blog/${featured.slug}`} className="block group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors duration-300">
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-wider">
                    <Flame size={10} className="inline mr-1.5" />
                    Featured
                  </span>
                  <span className="text-xs text-white/30">{featured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-white/90 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-white/40 leading-relaxed mb-6 line-clamp-3">
                  {featured.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <Calendar size={12} />
                    {featured.publishedAt}
                    <span className="mx-1">&middot;</span>
                    {featured.author}
                  </div>
                  <span className="text-white/60 text-sm font-semibold flex items-center gap-1 group-hover:text-white transition-colors">
                    Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Reading Stats Strip
// ────────────────────────────────────────

function ReadingStats() {
  return (
    <section className="py-10 bg-white border-b border-[#0F4C81]/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          {[
            { value: '10+', label: 'In-depth articles', icon: BookOpen },
            { value: '45 min', label: 'Average read time', icon: Clock },
            { value: '8', label: 'Topics covered', icon: Tag },
            { value: 'Weekly', label: 'New articles', icon: Sparkles },
          ].map((stat, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: si * 0.05 }}
              className="flex items-center gap-3"
            >
              <stat.icon size={16} className="text-[#0F4C81]/30" />
              <div className="text-left">
                <p className="text-sm font-bold text-[#082032]">{stat.value}</p>
                <p className="text-[11px] text-[#082032]/35">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Topic Explorer
// ────────────────────────────────────────

function TopicExplorer({ selectedCategory, setSelectedCategory }: {
  selectedCategory: string | null;
  setSelectedCategory: (v: string | null) => void;
}) {
  const topics = [
    { name: 'All', icon: Sparkles, color: 'bg-[#0F4C81]/10 text-[#0F4C81]', key: null as string | null },
    { name: 'Guides', icon: BookOpen, color: 'bg-blue-50 text-blue-600', key: 'Guides' },
    { name: 'Business Tips', icon: TrendingUp, color: 'bg-green-50 text-green-600', key: 'Business Tips' },
    { name: 'Inventory', icon: Boxes, color: 'bg-violet-50 text-violet-600', key: 'Inventory' },
    { name: 'Customer Service', icon: Users, color: 'bg-amber-50 text-amber-600', key: 'Customer Service' },
    { name: 'Finance', icon: IndianRupee, color: 'bg-emerald-50 text-emerald-600', key: 'Finance' },
    { name: 'Operations', icon: BarChart3, color: 'bg-orange-50 text-orange-600', key: 'Operations' },
    { name: 'Sustainability', icon: Leaf, color: 'bg-teal-50 text-teal-600', key: 'Sustainability' },
    { name: 'Strategy', icon: Lightbulb, color: 'bg-pink-50 text-pink-600', key: 'Strategy' },
    { name: 'Future Trends', icon: Smartphone, color: 'bg-indigo-50 text-indigo-600', key: 'Future Trends' },
  ];

  return (
    <section className="py-10 bg-[#F5F9FC]">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {topics.map((topic, ti) => {
            const isActive = selectedCategory === topic.key;
            return (
              <motion.button
                key={ti}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: ti * 0.03 }}
                onClick={() => setSelectedCategory(topic.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-lg shadow-[#0F4C81]/15'
                    : 'bg-white text-[#082032]/60 border-[#0F4C81]/10 hover:border-[#0F4C81]/30 hover:text-[#0F4C81]'
                }`}
              >
                <topic.icon size={13} />
                {topic.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Articles Grid
// ────────────────────────────────────────

function ArticlesGrid({ posts }: { posts: typeof BLOG_POSTS }) {
  if (posts.length === 0) {
    return (
      <section className="py-20 bg-[#F5F9FC]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F4C81]/5 text-[#0F4C81]/30 mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-semibold text-[#082032] mb-2">No articles found</h3>
          <p className="text-sm text-[#082032]/40">Try adjusting your search or category filter.</p>
        </div>
      </section>
    );
  }

  // First 2 posts get larger treatment, rest are standard cards
  const heroPost = posts[0];
  const secondPost = posts.length > 1 ? posts[1] : null;
  const remainingPosts = posts.slice(2);

  return (
    <section className="py-16 bg-[#F5F9FC]">
      <div className="container mx-auto px-6">
        {/* Top 2 articles in larger layout */}
        {posts.length >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[heroPost, secondPost].filter(Boolean).map((post, pi) => (
              <motion.div
                key={post!.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: pi * 0.1 }}
              >
                <Link to={`/blog/${post!.slug}`} className="block group h-full">
                  <div className="bg-white rounded-3xl border border-[#0F4C81]/10 overflow-hidden h-full hover:shadow-xl hover:shadow-[#0F4C81]/5 transition-all duration-300">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post!.coverImage}
                        alt={post!.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-[11px] font-bold uppercase tracking-wider">
                          {post!.category}
                        </span>
                        <span className="text-xs text-[#082032]/30">{post!.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#082032] mb-3 leading-tight group-hover:text-[#0F4C81] transition-colors">
                        {post!.title}
                      </h3>
                      <p className="text-sm text-[#082032]/50 leading-relaxed mb-4 line-clamp-2">
                        {post!.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#082032]/30">
                          <Calendar size={12} />
                          {post!.publishedAt}
                        </div>
                        <span className="text-[#0F4C81] text-sm font-semibold flex items-center gap-1">
                          Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Remaining posts in 3-column grid */}
        {remainingPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Editor's Picks
// ────────────────────────────────────────

function EditorPicks() {
  const picks = [
    { post: BLOG_POSTS[2], reason: 'Most saved article' },
    { post: BLOG_POSTS[4], reason: 'Top rated by readers' },
    { post: BLOG_POSTS[6], reason: 'Trending this week' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">Editor&apos;s Picks</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#082032]">Must-read articles</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {picks.map((pick, pi) => (
            <motion.div
              key={pick.post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: pi * 0.1 }}
            >
              <Link to={`/blog/${pick.post.slug}`} className="block group">
                <div className="bg-[#F5F9FC] rounded-2xl p-5 border border-[#0F4C81]/5 hover:shadow-lg hover:shadow-[#0F4C81]/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                      <img src={pick.post.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{pick.reason}</span>
                      <h4 className="text-sm font-bold text-[#082032] mt-1 mb-1 line-clamp-2 group-hover:text-[#0F4C81] transition-colors">
                        {pick.post.title}
                      </h4>
                      <span className="text-[11px] text-[#082032]/35">{pick.post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Newsletter CTA
// ────────────────────────────────────────

function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-20 bg-[#0F4C81] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-white/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 text-white">
            <Mail size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Get smarter every week.
          </h2>
          <p className="text-lg text-white/40 mb-8 leading-relaxed">
            One email a week with practical retail tips, new features, and success stories from shop owners like you.
          </p>

          {!submitted ? (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 px-5 rounded-full bg-white/10 text-white placeholder:text-white/30 border border-white/15 focus:outline-none focus:border-white/40 text-sm transition-colors"
              />
              <Button
                onClick={() => { if (email.includes('@')) setSubmitted(true); }}
                className="h-12 px-8 rounded-full bg-white text-[#0F4C81] hover:bg-white/90 font-semibold shadow-lg"
              >
                Subscribe
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/15"
            >
              <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={18} className="text-green-300" />
              </div>
              <p className="text-white font-semibold mb-1">You are in!</p>
              <p className="text-sm text-white/40">We will send you the best articles every week.</p>
            </motion.div>
          )}

          <p className="text-xs text-white/20 mt-4">No spam, unsubscribe anytime. Trusted by 2,500+ shop owners.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Why Read Section
// ────────────────────────────────────────

function WhyRead() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-4">
            Written for shop owners, by shop owners.
          </h2>
          <p className="text-lg text-[#082032]/40 max-w-xl mx-auto">
            No jargon. No fluff. Just actionable advice that works in the real world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Zap, title: 'Practical tips', desc: 'Every article gives you something you can implement today' },
            { icon: IndianRupee, title: 'Real numbers', desc: 'Backed by data from 2,500+ shops across India' },
            { icon: Heart, title: 'Community stories', desc: 'Learn from shop owners who have been where you are' },
          ].map((item, ii) => (
            <motion.div
              key={ii}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ii * 0.1 }}
              className="text-center p-6 rounded-2xl bg-[#F5F9FC] border border-[#0F4C81]/5"
            >
              <item.icon size={20} className="text-[#0F4C81] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[#082032] mb-1">{item.title}</h3>
              <p className="text-xs text-[#082032]/40">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Main Blog List Page
// ────────────────────────────────────────

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col">
      <BlogHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ReadingStats />
      <TopicExplorer selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <ArticlesGrid posts={filteredPosts} />
      <EditorPicks />
      <NewsletterCTA />
      <WhyRead />
      <Footer />
    </div>
  );
}

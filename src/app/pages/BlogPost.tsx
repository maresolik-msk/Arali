import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Copy, Lightbulb, User, Tag } from 'lucide-react';
import { BLOG_POSTS, BlogPost as BlogPostType, BlogContentBlock } from '../data/blogData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Footer } from '../components/layout/Footer';
import { toast } from 'sonner';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      // Ideally show a proper 404
      // navigate('/404'); 
    }
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [post, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F9FC] p-6">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-4">Article Not Found</h1>
        <p className="text-[#082032]/60 mb-8">The article you are looking for does not exist or has been moved.</p>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    // Try Web Share API first (great for mobile)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled or not supported, fall back to clipboard
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Robust Clipboard Fallback
    const fallbackCopy = () => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          toast.success("Link copied to clipboard!");
        } else {
          throw new Error("Copy failed");
        }
      } catch (err) {
        toast.error("Could not copy link", {
          description: "Please copy the URL manually."
        });
      }
    };

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      // Silently fail over to legacy method if Clipboard API is blocked
      fallbackCopy();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar placeholder - could be added if needed */}
      
      {/* Hero Section */}
      <section className="bg-[#F5F9FC] pt-32 pb-16 relative">
         <div className="container mx-auto px-6 max-w-4xl">
            <Link to="/blog" className="inline-flex items-center text-[#0F4C81] hover:underline mb-8 font-medium text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
            </Link>
            
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <Badge className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white border-0 px-3 py-1 text-sm">
                {post.category}
              </Badge>
              <div className="flex items-center text-[#082032]/60 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                {post.publishedAt}
              </div>
              <div className="flex items-center text-[#082032]/60 text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#082032] mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-[#082032]/60 leading-relaxed font-light"
            >
              {post.subtitle}
            </motion.p>
         </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12">
           
           {/* Article Body */}
           <div className="lg:w-full">
              {/* Cover Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl overflow-hidden shadow-xl mb-12 aspect-[16/9]"
              >
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
              </motion.div>

              <div className="prose prose-lg prose-blue max-w-none">
                {post.content.map((block, index) => (
                  <ContentBlock key={index} block={block} />
                ))}
              </div>

              {/* Author & Share */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                        <User size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Written by</div>
                        <div className="font-bold text-[#082032]">{post.author}</div>
                      </div>
                   </div>

                   <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 mr-2">Share this:</span>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-[#082032]" onClick={handleShare}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-[#082032]">
                         <Facebook size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-[#082032]">
                         <Twitter size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 text-[#082032]">
                         <Linkedin size={16} />
                      </Button>
                   </div>
                </div>
              </div>
           </div>

           {/* Sidebar (Optional - could be related posts or sticky CTA) */}
           <div className="hidden lg:block w-full max-w-xs space-y-8 sticky top-32 h-fit">
              <div className="bg-[#F5F9FC] p-6 rounded-2xl border border-[#0F4C81]/10">
                <h3 className="font-bold text-[#0F4C81] mb-4">Try Arali Today</h3>
                <p className="text-sm text-[#082032]/70 mb-6">
                  Ready to implement these tips? Start your digital journey with Arali's free plan.
                </p>
                <Link to="/get-started">
                  <Button className="w-full bg-[#0F4C81] hover:bg-[#0F4C81]/90">Get Started Free</Button>
                </Link>
              </div>

              <div>
                <h3 className="font-bold text-[#082032] mb-4 text-sm uppercase tracking-wider">Topics</h3>
                <div className="flex flex-wrap gap-2">
                   {['Inventory', 'Finance', 'Tips', 'Growth', 'Retail'].map(tag => (
                     <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-gray-200 font-normal">
                       {tag}
                     </Badge>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </div>
      
      {/* Related Posts could go here */}

      <Footer />
    </div>
  );
}

function ContentBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-3xl font-bold text-[#0F4C81] mt-12 mb-6">{block.value}</h2>;
    
    case 'subheading':
      return <h3 className="text-2xl font-bold text-[#082032] mt-8 mb-4">{block.value}</h3>;
    
    case 'paragraph':
      return <p className="text-xl text-[#082032]/80 leading-relaxed mb-8 font-light">{block.value}</p>;
    
    case 'list':
      return (
        <ul className="space-y-4 mb-8 my-6">
          {(block.value as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-[#082032]/80">
              <div className="mt-2 w-2 h-2 rounded-full bg-[#0F4C81] shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    
    case 'tip':
      return (
        <div className="bg-[#EBF4FA] border-l-4 border-[#0F4C81] p-6 my-8 rounded-r-xl">
           <div className="flex items-center gap-3 mb-2 text-[#0F4C81] font-bold text-lg">
             <Lightbulb size={24} />
             {block.title || 'Pro Tip'}
           </div>
           <p className="text-[#082032]/80 italic text-lg">{block.value}</p>
        </div>
      );
      
    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-6 my-8 italic text-2xl text-gray-500 font-serif">
          "{block.value}"
        </blockquote>
      );

    case 'image':
      return (
        <figure className="my-10">
          <img 
            src={block.imageUrl || (block.value as string)} 
            alt={block.imageCaption || 'Blog image'} 
            className="w-full rounded-2xl shadow-lg"
          />
          {block.imageCaption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      );
      
    default:
      return null;
  }
}

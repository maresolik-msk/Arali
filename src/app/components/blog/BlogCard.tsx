import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../data/blogData';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { cn } from '../ui/utils';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className={cn("h-full overflow-hidden border-[#0F4C81]/10 bg-white hover:shadow-xl hover:shadow-[#0F4C81]/5 transition-all duration-300 flex flex-col", className)}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[#0F4C81] hover:bg-white border-0 shadow-sm">
                {post.category}
              </Badge>
            </div>
          </div>
          
          <CardHeader className="p-6 pb-2">
            <h3 className="text-xl font-bold text-[#082032] line-clamp-2 leading-tight mb-2 group-hover:text-[#0F4C81] transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-[#082032]/50 font-medium uppercase tracking-wide">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-2 flex-grow">
            <p className="text-[#082032]/70 text-sm leading-relaxed line-clamp-3">
              {post.description}
            </p>
          </CardContent>
          
          <CardFooter className="p-6 pt-0 mt-auto">
            <div className="flex items-center text-[#0F4C81] text-sm font-semibold group">
              Read Article 
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

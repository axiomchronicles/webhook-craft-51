import { motion } from 'framer-motion';
import { Loader2, Zap, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pulse' | 'orbit' | 'wave';
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerSizes = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg'
  };

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-primary-glow rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground font-medium"
        >
          {text}
        </motion.p>
      </div>
    );
  }

  if (variant === 'orbit') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
        <div className="relative">
          <motion.div
            className={`${sizeClasses[size]} border-2 border-primary/20 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '50% 16px' }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground font-medium"
        >
          {text}
        </motion.p>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-6 bg-gradient-to-t from-primary to-primary-glow rounded-full"
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground font-medium mt-3"
        >
          {text}
        </motion.p>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground font-medium"
      >
        {text}
      </motion.p>
    </div>
  );
}

export function PageLoadingState({ 
  title = 'Loading Page',
  description = 'Please wait while we load the content...'
}: { 
  title?: string;
  description?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-96 p-8"
    >
      <motion.div
        className="relative mb-6"
        animate={{
          rotateY: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-xl flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-foreground mb-2"
      >
        {title}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-center max-w-md"
      >
        {description}
      </motion.p>

      <motion.div
        className="flex gap-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
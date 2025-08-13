import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';

interface MagicBoxProps {
  onOpen: () => void;
}

const MagicBox: React.FC<MagicBoxProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <div className="relative">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${15 + (i * 8)}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + (i * 0.2),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        ))}
      </div>

      {/* Magic Box */}
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Box Shadow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl blur-xl"
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.8 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main Box */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 shadow-2xl"
          animate={{
            rotateY: isOpening ? 180 : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Box Lid */}
          <motion.div
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-t-3xl"
            animate={{
              rotateX: isOpening ? -90 : 0,
              transformOrigin: "bottom",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Gift Icon */}
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isOpening ? 360 : 0,
            }}
            transition={{ duration: isOpening ? 1 : 0.3 }}
          >
            <Gift className="w-16 h-16 text-white" />
          </motion.div>

          {/* Magical Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 via-transparent to-transparent rounded-3xl"
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Opening Effect */}
        {isOpening && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: Math.cos((i * 30) * Math.PI / 180) * 100,
                  y: Math.sin((i * 30) * Math.PI / 180) * 100,
                  opacity: [1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MagicBox;
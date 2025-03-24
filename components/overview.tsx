import { motion } from 'framer-motion';
import Image from 'next/image';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
           <div className="size-70 rounded-full border-2 border-white flex items-center justify-center mx-auto">
                   <Image
                 src="/images/ready_ape.png"
                 alt="ready ape Logo"
                 width={170}
                 height={170}
                 className="rounded-full"
                   />
                  
                   </div>
        </p>
        <p>
          This is{' '}
          <span className="font-medium underline underline-offset-4 ">
            Ready Ape
          </span>
          , a chatbot leveraging a multi-modal and reasoning model. It combines
          advanced AI capabilities to deliver a seamless and intelligent chat
          experience.
        </p>
      </div>
    </motion.div>
  );
};

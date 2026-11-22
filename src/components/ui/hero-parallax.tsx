"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

type ParallaxItem = {
  title: string;
  link?: string;
  thumbnail: string;
  objectPosition?: string;
};

export const HeroParallax = ({
  products,
  progress,
  embedded = false,
  staticMode = false,
}: {
  progress?: MotionValue<number>;
  embedded?: boolean;
  staticMode?: boolean;
  products: ParallaxItem[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const timeline = progress ?? scrollYProgress;

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(timeline, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(timeline, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(timeline, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(timeline, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(timeline, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(timeline, [0, 0.2], embedded ? [-90, 0] : [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className={embedded ? "hero-project-parallax overflow-hidden relative flex flex-col [perspective:1000px] [transform-style:preserve-3d]" : "h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"}
    >
      {!embedded && <Header />}
      <motion.div
        style={staticMode ? undefined : {
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className={embedded ? "flex flex-row-reverse gap-6 mb-6" : "flex flex-row-reverse space-x-reverse space-x-20 mb-20"}>
          {firstRow.map((product, index) => (
            <ProductCard
              product={product}
              embedded={embedded}
              staticMode={staticMode}
              translate={translateX}
              key={`${product.title}-${index}`}
            />
          ))}
        </motion.div>
        <motion.div className={embedded ? "flex flex-row gap-6 mb-6" : "flex flex-row  mb-20 space-x-20 "}>
          {secondRow.map((product, index) => (
            <ProductCard
              product={product}
              embedded={embedded}
              staticMode={staticMode}
              translate={translateXReverse}
              key={`${product.title}-${index}`}
            />
          ))}
        </motion.div>
        <motion.div className={embedded ? "flex flex-row-reverse gap-6" : "flex flex-row-reverse space-x-reverse space-x-20"}>
          {thirdRow.map((product, index) => (
            <ProductCard
              product={product}
              embedded={embedded}
              staticMode={staticMode}
              translate={translateX}
              key={`${product.title}-${index}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        The Ultimate <br /> development studio
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  embedded = false,
  staticMode = false,
}: {
  product: ParallaxItem;
  translate: MotionValue<number>;
  embedded?: boolean;
  staticMode?: boolean;
}) => {
  return (
    <motion.div
      style={staticMode ? undefined : { x: translate }}
      whileHover={staticMode ? undefined : { y: -20 }}
      key={product.title}
      className={embedded ? "hero-project-card group/product relative shrink-0" : "group/product h-96 w-[30rem] relative shrink-0"}
    >
      <a
        href={product.link}
        tabIndex={embedded && product.link ? 0 : undefined}
        className="block group-hover/product:shadow-2xl "
      >
        <img
          src={product.thumbnail}
          style={product.objectPosition ? { objectPosition: product.objectPosition } : undefined}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};

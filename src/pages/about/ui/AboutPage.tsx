import WebPagesHeader from '@/widgets/web-pages-header';

export default function AboutPage() {
  return (
    <>
      <WebPagesHeader />
      <main className="relative flex flex-col justify-center sm:items-center size-full pt-16 bg-white dark:bg-neutral-800">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 py-8 px-4 sm:px-6 lg:px-8 sm:text-lg text-gray-600 dark:text-gray-400">
          <h1 className="mt-1 sm:mt-3 text-4xl font-bold sm:text-6xl font-bold text-gray-900 dark:text-gray-100">
            About project
          </h1>
          <section className="flex flex-col py-4">
            <h2 className="text-2xl sm:text-4xl py-2 text-gray-700 dark:text-gray-300">Prismalaser</h2>
            <p>
              Prisma schema visualization tool with schema editor. It allows users easily edit schemas with syntax
              highlight and autoformat them. It also includes graphic visualization of relations between models,
              including &quot;one to one&quot;, &quot;many to many&quot; types of relations and relations with enums.
            </p>
          </section>
          <div className="flex flex-col py-4">
            <h2 className="text-2xl sm:text-4xl py-2 text-gray-700 dark:text-gray-300">Features:</h2>
            <ul className="space-y-1 list-disc list-inside dark:text-gray-400">
              <li>Auto format and validate prisma schema in editor</li>
              <li>Save schema to file</li>
              <li>Save full schema visualization as png file in good quality</li>
              <li>Create sharable link of your schema (no data stored on server)</li>
              <li>Save and load layout of your schema visualization in prisma schema</li>
            </ul>
          </div>
          <div className="flex flex-col py-4">
            <h2 className="text-2xl sm:text-4xl py-2 text-gray-700 dark:text-gray-300">History of project</h2>
            <div className="flex flex-col py-2 gap-2">
              <h3 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">The original project</h3>
              <p>
                This project is deep fork of another tool -{' '}
                <a href="https://github.com/Ovyerus/prismaliser">Prismaliser</a> by{' '}
                <a href="https://github.com/Ovyerus">Ovyerus</a> (the origin author) and{' '}
                <a href="https://github.com/Ovyerus/prismaliser/graphs/contributors">contributors</a>. A want to say big
                thank you for everyone for this fantastic opportunity. Their dedication, time and competence made this
                project possible.
              </p>
            </div>
            <div className="flex flex-col py-2 gap-2">
              <h3 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
                Reason to remake previous project
              </h3>
              <p>
                When I first stumbled upon original Prismaliser, I immediately loved idea of tool allowing you so easy
                to selfhost and minimal steps to setup. After some time I spent working with this tool, I found, that,
                there are a lot of ways how I can make it better, and some features I wanted to see.
              </p>
              <p>
                I forked original repository, and started to modify the code, but more and more I edited it and
                refactored it, more I felt like current code for me is more constrains then support. Before I knew it, I
                have already moved to Nextjs 15, App router and made more significant changes in code which were
                absolutely outside of scope &quot;fix a little bit&quot;, and were incompatible with source repository.
              </p>
              <p>
                Science then I just decided to move forward and make it separate project based on previous one, the way
                I see it. I updated all dependencies and moved project form Pages Router to App Router. I fixed some
                problems with types and introduced centralized app state store as Redux and RTK. App was moved to
                Feature-Sliced Design and I have implemented other small changes.
              </p>
            </div>
            <div className="flex flex-col py-2 gap-2">
              <h3 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">Why Prismalaser?</h3>
              <p>
                In order to denote that this is now a different application and to avoid misleading with the original
                Prismalasier, I have changed the branding and application name to something similar but a little
                different, so now it&apos;s Prismalaser. I wanted to leave the &quot;Prisma&quot; part of the name and
                to change the second one. My first association, when I have been thinking about Prisma, was the laser,
                which is shining through the prism and deflecting in all different ways. This is how I took this name.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

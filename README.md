# Prismalaser

Prisma ORM schema editor, schema visualization and more.

## Description

Prismalaser is a Prisma ORM schema visualization tool with a schema editor, which allows you to view interactive graphical representations of your models and enums and their interconnections and conveniently update them on the fly via the schema editor.

## Features

### Auto format and validate prisma schema in editor

#### Schema validation

You prisma schema is constantly validated against prisma, in if any problems will be detected, in schema editor you on right side in the bottom you will right cross, that means you schema contains syntax errors. Also this errors will be highlighted in schema editor.

#### Autoformat schema

In Editor in top menu click "File" > "Format". Your current schema.prisma will be formatted according to official prisma formatter.

### Save schema to file

In Editor in top menu click "File" > "Download Schema". Your current schema.prisma will be saved on your device.

### Save full schema visualization as png file in good quality

In Editor right part of the window dedicated to schema viewer. On its left side in the bottom, there is floating buttons, click on download icon, to save on your device image of all nodes in high quality fitted in the view.

### Create sharable link of your schema (no data stored on server)

In Editor in top menu click "File" > "Copy link". Your current schema.prisma will be transformed into the link. This link itself will contain compressed text of the schema.

Please take note, that maximum length of link restricted in most application, due to that, big schemas may not work.

### Save schema visualization objects positions right in your ```schema.prisma```

Schema visualization objects positioning embedded right in schema sources. No need for cloud sync or additional files to save position of each object on visualization.

**For the first time use top menu "File" > "Add position comments", this will update your schema with additional comments so they can provide positioning data.**  Since then, just drag and drop your objects, while Prismalaser saves this data right away.

Prismalaser supports special type of comments ```/// @Prismalaser.position(x: 100, y: -100)``` for ```schema.prisma``` files which allows you to effetely store position information, and it automatically update those comments while you are editing dragging objects across visualization.

### Light and dark theme

In Editor in top menu on the right side click icon of sun/moon to switch application between light and dark theme.

## Stack

This is Next.js web application consist of frontend and API routes. We are using:

- Typescript
- Next.js 15 with App Router
- React 19 and React Server Components
- Tailwind CSS, SCSS, PostCSS
- Redux
- React Flow
- Monaco Editor for React
- ESlint and Prettier
- Prisma

## How to run

### Locally with NPM

Firstly, you need to install all required dependencies.

```sh
npm i
```

#### Run locally in dev mode

Science this is Next.js project you can run it locally form sources.
To run this project in dev mode use:

```sh
npm run dev
```

### Run in docker

Latest release of the project are published via CI to GitHub Container Registry, you can pull image and run by this command:

```sh
docker run -p 3000:3000 ghcr.io/thirdmadman/prismalaser
```

## Credits

This project deep rework of [Prismaliser](https://github.com/Ovyerus/prismaliser), thanks to [@Ovyerus](https://github.com/Ovyerus) and contributors for this opportunity.

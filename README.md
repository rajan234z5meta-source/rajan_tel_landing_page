# Telegram landing page

A static HTML/CSS/JavaScript landing page. No install or build step is needed.

## Preview locally

Open `index.html` in a browser. Save changes to `config.js`, then refresh the page.

## Reuse for a client

Edit `config.js` for all client content and tracking settings:

- `channelName`, `description`, `activeUsers`: channel details. The member count is manually maintained.
- `displayPicture`: a local path such as `./assets/my-channel.webp` or a full HTTPS image URL. Failed images fall back to the channel's first letter.
- `telegramUrl`: the Join button's destination. Leaving it blank disables navigation.
- `advertisingManager`, `advertisingEmail`: public advertising contact details. The strip is hidden unless both are present and the email has a basic valid format.
- `metaPixelId`: the client's Meta Pixel ID, in quotes. Set it to `''` to disable Pixel loading and tracking. A nonnumeric ID also disables tracking.
- `pageTitle`, `metaDescription`: optional browser title and metadata description. Blank values use the channel name and description. These are applied with JavaScript; crawlers that do not run JavaScript see generic HTML metadata.
- `headingBefore`, `headingHighlight`, `headingAfter`: heading text, with the middle part accented. Nonempty parts are separated by spaces.
- `subtitle`, `channelLabel`, `memberLabel`, `buttonText`, `badgeLine1`, `badgeLine2`, `disclaimer`: remaining page copy. Text is displayed literally, not as HTML.

This config is publicly served. Never include passwords, tokens, or other secrets.

The config loads before `script.js`. JavaScript is required for client content and the join link; there are no previous-client fallback details or tracking IDs in `index.html`. No tracking image is included for visitors with JavaScript disabled because it cannot read the configured Pixel ID.

## Change the color palette

Edit the `theme` block in `config.js` using six-digit hex colors (`#RRGGBB`). The current palette is emerald and charcoal.

- `background`: page background and browser theme color.
- `cardTop`, `cardBottom`, `border`: card gradient and edges.
- `heading`, `text`, `muted`: heading, body, and secondary text colors.
- `accent`, `accentMuted`: heading highlight, decorative lines, and avatar ring.
- `primary`, `primaryHover`, `onPrimary`: Join button background, hover background, and label/icon color.
- `member`: member count highlight.

Glows, separators, and shadows use these colors automatically. Invalid or missing colors keep their CSS defaults. Keep strong contrast between text and its background when choosing a new palette.

Layout and animations remain in `style.css`. The decorative tag image is in `assets/` and is displayed in neutral gray to suit different palettes; the client's avatar keeps its original colors.

## Upload and deploy

Upload `index.html`, `config.js`, `script.js`, `style.css`, and the `assets/` folder to the client's GitHub repository, preserving this folder structure. Keep `.assetsignore` if using Cloudflare Workers static assets. Do not upload `.git`, editor folders, or secrets.

Connect that repository in the client's Cloudflare account. This site requires no build; the directory containing `index.html` is the static site directory. Deployment configuration depends on whether you choose Pages or Workers static assets.

## Check tracking before launch

With a valid `metaPixelId`, the page records `PageView` on load and the custom event `TelegramClick` when someone manually clicks Join. A click does not confirm Telegram membership. Normal navigation waits 180 ms to allow the click event to send.

After deployment, use Meta Events Manager Test Events to verify both events against the client's Pixel. Browser tracking blockers may prevent events. Review all channel details, the destination link, disclaimer, and Pixel ID before using the page for ads.

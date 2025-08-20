# ThoughtForge

A medieval-themed learning management system built with Next.js that allows users to explore philosophical texts, share insights, and engage in scholarly discussions.

## Features

- 📚 Browse and read classic philosophical texts from Gutenberg Project
- ✍️ Create and share personal reflections and entries
- 🎓 Enroll in courses and complete reading assignments
- 👥 Share content with other scholars
- ❤️ Like and interact with other users' entries
- 🏰 Medieval-themed UI with pixel art styling

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Bulma CSS
- **Backend**: Django REST Framework
- **Authentication**: Token-based auth
- **API Integration**: Project Gutenberg
- **Styling**: Custom medieval/pixel art theme

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thoughtforge-client.git
cd thoughtforge-client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
thoughtforge-client/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable UI components
│   ├── courses/          # Course-related pages
│   ├── entries/         # Entry management
│   ├── readings/        # Reading view components
│   └── data/           # API and data fetching
├── public/              # Static assets
└── styles/             # Global styles and themes
```

## Development

- Run tests: `npm test`
- Format code: `npm run format`
- Lint code: `npm run lint`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Add your license here]

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Texts provided by [Project Gutenberg](https://www.gutenberg.org)
- CSS Framework by [Bulma](https://bulma.io)
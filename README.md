# Codon Visualizer - Improved Project Structure

This project has been structured to follow modern software development best practices with clear separation of concerns, modular architecture, and maintainable code organization.

## Project Overview

The Codon Visualizer is a web application for analyzing and visualizing codon sequences with graph-based representations. It consists of a Python Flask backend for data processing and a React frontend for interactive visualization.

## Improved Architecture

### Backend Structure (`/backend`)

The backend has been completely structured  to a layered architecture:

```
backend/
├── app.py                 # Main application entry point
├── requirements.txt       # Python dependencies
├── api/                   # API layer
│   ├── __init__.py
│   └── routes.py         # RESTful API endpoints
├── services/             # Business logic layer
│   ├── __init__.py
│   ├── codon_service.py  # Codon processing logic
│   ├── graph_service.py  # Graph generation logic
│   └── properties_service.py # Properties calculation logic
└── utils/                # Utility functions
    ├── __init__.py
    ├── codon_utils.py    # Codon manipulation utilities
    ├── graph_utils.py    # Graph processing utilities
    ├── processing_utils.py # Data processing utilities
    └── properties_utils.py # Properties calculation utilities
```



#### API Endpoints:

- `POST /api/graphs/original` - Get original codon graph
- `POST /api/graphs/alpha-one` - Get alpha-1 transformed graph
- `POST /api/graphs/alpha-two` - Get alpha-2 transformed graph
- `POST /api/graphs/alpha-three` - Get alpha-3 transformed graph
- `POST /api/properties/original` - Get original codon properties
- `POST /api/properties/alpha-one` - Get alpha-1 properties
- `POST /api/properties/alpha-two` - Get alpha-2 properties
- `POST /api/properties/alpha-three` - Get alpha-3 properties
- `POST /api/properties/c3` - Get C3 properties
- `POST /api/graphs/longest-path` - Get longest path in graph

### Frontend Structure (`/frontend`)

The frontend has been structured to follow modern React component organization:

```
frontend/src/
├── main.jsx              # Application entry point
├── store.js              # Zustand state management
├── index.css             # Global styles
├── components/           # Reusable components
│   ├── graph.jsx         # Main graph component
│   ├── GraphProperties/  # Properties panel component
│   │   ├── index.jsx
│   │   └── styles.css
│   ├── GraphsTabs/       # Tab navigation component
│   │   ├── index.jsx
│   │   └── styles.css
│   ├── LayoutButtons/    # Layout control component
│   │   ├── index.jsx
│   │   └── styles.css
│   ├── OverlayGraphs/    # Graph overlay component
│   │   ├── index.jsx
│   │   └── styles.css
│   └── icons/            # Icon components
│       ├── check.jsx
│       ├── chevron.jsx
│       ├── circular.jsx
│       ├── force-directed.jsx
│       ├── theme-toggle.jsx
│       └── unchecked.jsx
├── routes/               # Page components
│   ├── home.jsx          # Home page
│   ├── codons-graph.jsx  # Main graph visualization page
│   └── prototype.jsx     # Prototype page
└── css/                  # Remaining global styles
    ├── codons-graph.css
    └── home.css
```



## Running the Application

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## Future Improvements

1. **Testing**: Add comprehensive unit and integration tests
2. **Documentation**: Add API documentation with OpenAPI/Swagger
3. **Type Safety**: Add TypeScript to the frontend
4. **Performance**: Implement caching and optimization strategies
5. **Deployment**: Add Docker configuration and CI/CD pipeline

## Technologies Used

### Backend
- **Flask**: Web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Pandas**: Data manipulation (if needed)

### Frontend
- **React**: UI framework
- **Vite**: Build tool and development server
- **Zustand**: State management
- **React Router**: Client-side routing
- **Reagraph**: Graph visualization
- **File-saver**: File download functionality

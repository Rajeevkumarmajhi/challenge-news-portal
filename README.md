# 📰 NewsPortal – React + TypeScript News Aggregator

A modern, mobile-responsive news portal web app built using **React**, **TypeScript**, and **Tailwind CSS** with support for multiple news APIs including **NewsAPI**, **The Guardian**, and **The New York Times**. This project was built as part of a full-stack frontend challenge.

---

## 🚀 Features

- 🔍 **Search Articles**: Search across multiple news sources by keyword.
- 🧭 **Category Filtering**: Filter articles by category author.
- 🗓 **Date Range Filtering**: Select a custom date range to load relevant articles.
- 🌐 **Multiple News Sources**: Aggregates articles from:
  - NewsAPI
  - The Guardian
  - The New York Times
- 🎯 **Personalized Feed**: Choose preferred categories and sources (planned enhancement).
- 📱 **Mobile-Responsive UI**: Optimized for both desktop and mobile devices.
- 🧱 **Modular Architecture**: Built with reusable components, clear separation of concerns.
- 🐳 **Dockerized**: Easy to spin up locally using Docker.

---

## 🎯 Challenge Requirements

- ✅ React.js (with TypeScript) frontend
- ✅ Use at least **three** data sources from:
  - NewsAPI (Selected Source)
  - OpenNews
  - NewsCred
  - The Guardian (Selected Source)
  - NY Times (Selected Source)
  - BBC News
  - NewsAPLong
- ✅ Containerized using Docker
- ✅ Implements software development principles:
  - **DRY**: Don't Repeat Yourself
  - **KISS**: Keep It Simple, Stupid
  - **SOLID**: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion

## 🛠️ Installation and Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/news-portal-challenge.git
cd news-portal-challenge

### 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then, run:

```bash
npm install


### 3. Run the Application
...bash
npm run dev


## 🐳 Running the App with Docker

### 1. Build Docker Image

To build the Docker image, run:

```bash
docker build -t my-react-app .

### 2. Run Docker Container

After building the image, you can run the app in a Docker container:

```bash
docker run -d -p 80:80 --name my-react-app-container my-react-app

You can copy and paste this directly into your GitHub README. Let me know if this works!


## 💡 Demo

You can view the live demo of the application at:  
[https://news.rajeevkumarmajhi.com.np](https://news.rajeevkumarmajhi.com.np)

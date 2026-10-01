import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return <section className="section container empty-page"><p className="not-found-number">007 / 404</p><h1>This page is undercover.</h1><p>We couldn't find that page, but we know where to find good food.</p><Link className="button button-dark" to="/menu">Back to the menu<ArrowRight size={18} /></Link></section>;
}

import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Printer, Copy, FileText, CheckCircle, Clock } from 'lucide-react';

const Home = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-xerox-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Professional Printing Services On Demand
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Fast, affordable, high-quality printing solutions for all your needs. 
                Upload your files and we'll handle the rest.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-xerox-600 hover:bg-xerox-700">
                  <Link to="/order" className="text-white">
                    Start your order
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&q=80&w=600&h=600" 
                alt="Printing services" 
                className="rounded-lg shadow-lg max-w-full" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 underline decoration-4 decoration-gray-900">
              our service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Printing */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-800 p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 underline decoration-2">Printing</h3>
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&q=80&w=300&h=200" 
                  alt="Professional printing services with documents" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 rounded-none">
                <Link to="/order" className="text-white">
                  Order now
                </Link>
              </Button>
            </div>

            {/* Spiral Binding */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-800 p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 underline decoration-2">sprial binding</h3>
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1587613847022-473e31c6e4c8?auto=format&fit=crop&q=80&w=300&h=200" 
                  alt="Spiral bound notebooks and documents" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 rounded-none">
                <Link to="/order" className="text-white">
                  Order now
                </Link>
              </Button>
            </div>

            {/* Project Binding */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-800 p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 underline decoration-2">project binding</h3>
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=200" 
                  alt="Professional project binding and thesis binding" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 rounded-none">
                <Link to="/order" className="text-white">
                  Order now
                </Link>
              </Button>
            </div>

            {/* Photo Frame */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-800 p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 underline decoration-2">Photo frame</h3>
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1515378791036-0648a814c963?auto=format&fit=crop&q=80&w=300&h=200" 
                  alt="Professional photo frames and framing services" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <div className="text-gray-600 text-lg font-medium mb-4">comming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple 3-step process to get your documents printed
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-xerox-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">1. Upload Your Files</h3>
              <p className="mt-2 text-gray-600">
                Select and upload the files you want to print.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-xerox-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">2. Choose Options</h3>
              <p className="mt-2 text-gray-600">
                Select paper size, number of copies, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-xerox-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">3. Submit Order</h3>
              <p className="mt-2 text-gray-600">
                We'll process your order and have it ready for pickup.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-xerox-600 hover:bg-xerox-700">
              <Link to="/order" className="text-white">
                Place Your Order Now
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-xerox-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your Print Job?</h2>
          <p className="mt-4 text-xl">
            Fast, reliable printing services for your documents and files
          </p>
          <div className="mt-8">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-xerox-800">
              <Link to="/order">
                Order Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;

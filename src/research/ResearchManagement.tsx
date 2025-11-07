import React, { useState } from "react";
import {
  Briefcase, FileText, DollarSign, TrendingUp, Calendar, Building, Users,
  Search, Plus, Award, ChevronDown, Globe, Target
} from "lucide-react";
import { researchProjects } from "./researchProjects";
import { publications } from "./publications";
import { patentData } from "./patent";
import { getDisciplineColor, getStatusColor } from "./ResearchColors";

const ResearchManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);



  const OverviewDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">42</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Publications</p>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-xs text-green-600 mt-2">↑ 22% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Funding</p>
          <p className="text-3xl font-bold text-gray-900">$8.5M</p>
          <p className="text-xs text-gray-600 mt-2">Active grants</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Avg Citations</p>
          <p className="text-3xl font-bold text-gray-900">38.2</p>
          <p className="text-xs text-gray-600 mt-2">Per publication</p>
        </div>
      </div>

    

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Projects by Faculty</h3>
          <div className="space-y-4">
            {[
              {dept: 'Faculty of Nontraditional Security', count: 18, percentage: 43},
              {dept: 'Faculty of Management', count: 12, percentage: 29},
              {dept: 'Faculty of Marketing and Communication', count: 8, percentage: 19},
              {dept: 'Other Faculties', count: 4, percentage: 9}
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.dept}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publication Types</h3>
          <div className="space-y-4">
            {[
              {type: 'Journal Articles', count: 92, percentage: 59},
              {type: 'Conference Papers', count: 38, percentage: 24},
              {type: 'Book Chapters', count: 18, percentage: 12},
              {type: 'Patents', count: 8, percentage: 5}
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Researchers</h3>
          <div className="space-y-4">
            {[
              {name: 'Dr. Nguyen Van A', publications: 24, citations: 892},
              {name: 'Dr. Vo Thi F', publications: 18, citations: 756},
              {name: 'Dr. Pham Thi D', publications: 16, citations: 634}
            ].map((researcher, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{researcher.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-600">{researcher.publications} pubs</span>
                    <span className="text-xs text-gray-600">{researcher.citations} citations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Funding Sources</h3>
          <div className="space-y-3">
            {[
              {source: 'Nafosted', amount: '$3.2M', percentage: 38},
              {source: 'Ministry of Education', amount: '$2.8M', percentage: 33},
              {source: 'Ministry of Science and Technology', amount: '$1.5M', percentage: 18},
              {source: 'VNU', amount: '$1.0M', percentage: 11}
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-bold text-gray-900">{item.amount}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-600" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publications by Discipline</h3>
          <div className="space-y-3">
            {[
              {discipline: 'Nontraditional Security', count: 42, color: 'blue'},
              {discipline: 'Sustainable Development', count: 28, color: 'green'},
              {discipline: 'Engineering & IT', count: 24, color: 'purple'},
              {discipline: 'Human Resources', count: 18, color: 'green'},
              {discipline: 'Finance', count: 16, color: 'green'},
              {discipline: 'Marketing', count: 14, color: 'green'},
              {discipline: 'Communication', count: 10, color: 'green'},
              {discipline: 'Law & Criminology', count: 4, color: 'blue'}
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                  <span className="text-xs text-gray-700">{item.discipline}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-3">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="applied">Applied Research</option>
                <option value="basic">Basic Research</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} />
              New Project
            </button>
          </div>
        </div>
          <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">International</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Erasmus, EU, International grant</p>
          <p className="text-3xl font-bold text-gray-900">6</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">20% of total projects</p>
            <p className="text-xs text-green-600 mt-1">↑ 10% vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">National level</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Ministry, Nafosted, National Funding</p>
          <p className="text-3xl font-bold text-gray-900">6</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">20% of total projects</p>
            <p className="text-xs text-green-600 mt-1">↑ 10% vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
           
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">VNU</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">VNU projects, grants</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">40% of total projects</p>
            <p className="text-xs text-blue-600 mt-1">↑ 5% vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">HSB</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">HSB Projects / Company sponsored</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">20% of total projects</p>
            <p className="text-xs text-orange-600 mt-1">Action needed</p>
          </div>
        </div>
      </div>
        <div className="p-6 grid grid-cols-1 gap-4">
          {researchProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Users size={16} />
                        PI: {project.pi}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building size={16} />
                        {project.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Funding</p>
                    <p className="text-lg font-bold text-gray-900">{project.funding}</p>
                    <p className="text-xs text-gray-500">{project.fundingSource}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Progress</p>
                    <p className="text-lg font-bold text-gray-900">{project.progress}%</p>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-green-600" style={{width: `${project.progress}%`}}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Publications</p>
                    <p className="text-lg font-bold text-gray-900">{project.publications}</p>
                    <p className="text-xs text-gray-500">Published</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Team Size</p>
                    <p className="text-lg font-bold text-gray-900">{project.coInvestigators.length + 1}</p>
                    <p className="text-xs text-gray-500">Researchers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedItem({type: 'project', data: project})}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Edit
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PublicationsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book Chapter</option>
                <option value="book">Book</option>

              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="review">Under Review</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} />
              Add Publication
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Scopus</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Scopus Indexed</p>
          <p className="text-3xl font-bold text-gray-900">92</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">59% of total publications</p>
            <p className="text-xs text-green-600 mt-1">↑ 18 vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">WoS</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Web of Science</p>
          <p className="text-3xl font-bold text-gray-900">68</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">44% of total publications</p>
            <p className="text-xs text-green-600 mt-1">↑ 14 vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">DOI</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">With DOI</p>
          <p className="text-3xl font-bold text-gray-900">142</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">91% of total publications</p>
            <p className="text-xs text-blue-600 mt-1">Well documented</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">No DOI</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Without DOI</p>
          <p className="text-3xl font-bold text-gray-900">14</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">9% of total publications</p>
            <p className="text-xs text-orange-600 mt-1">Action needed</p>
          </div>
        </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Authors</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Journal/Venue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Discipline</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Citations</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-gray-900 max-w-xs">{pub.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {pub.authors.slice(0, 2).join(', ')}
                      {pub.authors.length > 2 && ` +${pub.authors.length - 2}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {pub.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{pub.journal}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisciplineColor(pub.discipline)}`}>
                      {pub.discipline}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.year}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.citations}</td>
                  <td className="px-6 py-4">
                    {pub.impactFactor ? (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{pub.impactFactor}</p>
                        <p className="text-xs text-gray-500">{pub.quartile}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pub.status)}`}>
                      {pub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedItem({type: 'publication', data: pub})}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  
  const filteredPatents = patentData.filter(patent => {
    const matchesSearch = patent.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patent.status === filterStatus;
    const matchesType = filterType === 'all' || patent.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });
  const PatentsView = () => (
    <div className="space-y-6">
         <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search patents by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Granted">Granted</option>
              <option value="Pending">Pending</option>
              <option value="Under Examination">Under Examination</option>
              <option value="International">International</option>
            </select>

            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Invention Patent">Invention Patent</option>
              <option value="Utility Model">Utility Model</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
              <Plus size={18} />
              New Patent
            </button>
          </div>
        </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Patents</p>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-green-600 mt-2">↑ 3 vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Granted Patents</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-green-600 mt-2">37.5% success rate</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Pending/Under Review</p>
          <p className="text-3xl font-bold text-gray-900">4</p>
          <p className="text-xs text-yellow-600 mt-2">Awaiting decision</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">International Patents</p>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-purple-600 mt-2">PCT & US</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
       

        <div className="p-6 space-y-4">
          {filteredPatents.map((patent) => (
            <div key={patent.id} className={`border-2 rounded-xl p-6 hover:shadow-lg transition-shadow ${getStatusColor(patent.status)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{patent.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patent.status)}`}>
                      {patent.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisciplineColor(patent.discipline)}`}>
                      {patent.discipline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{patent.abstract}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Users size={16} />
                      {patent.inventors.length} inventors
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building size={16} />
                      {patent.faculty}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {new Date(patent.applicationDate).toLocaleDateString()}
                    </span>
                    <span className="font-medium">
                      {patent.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <p className="text-sm font-bold text-gray-900">{patent.type}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Country</p>
                  <p className="text-sm font-bold text-gray-900">{patent.country}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Application No.</p>
                  <p className="text-sm font-mono text-gray-900">{patent.applicationNumber}</p>
                </div>
                {patent.patentNumber ? (
                  <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                    <p className="text-xs text-gray-600 mb-1">Patent No.</p>
                    <p className="text-sm font-mono font-bold text-green-700">{patent.patentNumber}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Patent No.</p>
                    <p className="text-sm text-gray-400">Pending</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedItem({type: 'patent', data: patent})}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          ))}
          {filteredPatents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No patents found matching your criteria
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patents by Faculty</h3>
          <div className="space-y-4">
            {[
              { name: 'Nontraditional Security', count: 4, percent: 50 },
              { name: 'Management', count: 2, percent: 25 },
              { name: 'Marketing & Communication', count: 1, percent: 12.5 },
              { name: 'Others', count: 1, percent: 12.5 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{width: `${item.percent}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patents by Discipline</h3>
          <div className="space-y-3">
            {[
              { discipline: 'Nontraditional Security', count: 2, color: 'blue' },
              { discipline: 'Engineering & IT', count: 1, color: 'purple' },
              { discipline: 'Sustainable Development', count: 2, color: 'green' },
              { discipline: 'Finance', count: 1, color: 'red' },
              { discipline: 'Marketing', count: 1, color: 'pink' },
              { discipline: 'Human Resources', count: 1, color: 'orange' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <span className="text-sm text-gray-700">{item.discipline}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patent Status Overview</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Granted</span>
                <span className="text-2xl font-bold text-green-700">3</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Pending</span>
                <span className="text-2xl font-bold text-yellow-700">3</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Under Examination</span>
                <span className="text-2xl font-bold text-orange-700">1</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">International</span>
                <span className="text-2xl font-bold text-purple-700">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage faculty projects, publications, and research output</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('projects')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveView('publications')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'publications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Publications
              </button>
              <button
                onClick={() => setActiveView('patents')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'patents' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Patents
              </button>
            </div>
          </div>
        </div>

        {activeView === 'overview' && <OverviewDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'publications' && <PublicationsView />}
        {activeView === 'patents' && <PatentsView />}

        {selectedItem && selectedItem.type === 'project' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {selectedItem.data.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.data.status)}`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.data.title}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedItem.data.pi}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Project Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Duration</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {new Date(selectedItem.data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(selectedItem.data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSign size={18} />
                      <span className="text-xs font-semibold uppercase">Funding</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.funding}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedItem.data.fundingSource}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building size={18} />
                      <span className="text-xs font-semibold uppercase">Department</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.department}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users size={18} />
                      <span className="text-xs font-semibold uppercase">Team Size</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.coInvestigators.length + 1} researchers</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Progress</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Completion</span>
                    <span className="text-lg font-bold text-gray-900">{selectedItem.data.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="h-3 rounded-full bg-blue-500"
                      style={{width: `${selectedItem.data.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Research Team</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{selectedItem.data.pi}</p>
                      <p className="text-xs text-gray-600">Principal Investigator</p>
                    </div>
                    {selectedItem.data.coInvestigators.map((investigator, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900">{investigator}</p>
                        <p className="text-xs text-gray-600">Co-Investigator</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Edit Project
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Publications
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedItem && selectedItem.type === 'publication' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {selectedItem.data.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.data.status)}`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.data.title}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedItem.data.year}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Authors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.data.authors.map((author, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {author}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Discipline</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDisciplineColor(selectedItem.data.discipline)}`}>
                    {selectedItem.data.discipline}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FileText size={18} />
                      <span className="text-xs font-semibold uppercase">Journal/Venue</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedItem.data.journal}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Publication Year</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.year}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <TrendingUp size={18} />
                      <span className="text-xs font-semibold uppercase">Citations</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.citations}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Award size={18} />
                      <span className="text-xs font-semibold uppercase">Impact Factor</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {selectedItem.data.impactFactor || 'N/A'}
                      {selectedItem.data.quartile && selectedItem.data.quartile !== 'N/A' && (
                        <span className="text-xs text-gray-600 ml-2">({selectedItem.data.quartile})</span>
                      )}
                    </p>
                  </div>
                </div>

                {selectedItem.data.doi && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">DOI</p>
                    <p className="text-sm font-mono text-blue-600">{selectedItem.data.doi}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Edit Publication
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Full Text
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Export Citation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchManagement;
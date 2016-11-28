require 'json'

# /Milestone4
class TestCoveredMethodFinder
	def covered_methods(test_case_desc)
		parent_dir_path = File.expand_path("../../../", __FILE__)
		separated_test_folder = "#{parent_dir_path}/solar-calc/separated_tests"
		json_file_path = "#{parent_dir_path}/solar-calc/coverage/coverage.json"
		source_file_arr = ['moon.js', 'solarCalc.js', 'sun.js']
		# filename -> method name -> test case filename
		covered_method_hash = {'moon.js' => {},
							   'solarCalc.js'=> {},
							   'sun.js' => {}
							  }
		# filename -> line number -> method name
		cache_covered_method_hash = {'moon.js' => {},
							   		 'solarCalc.js'=> {},
							   		 'sun.js' => {}
							   		}
		#
		# create csv file to store results
		#
		# result_file_path = "#{parent_dir_path}/DevOps-M4/test_covered_method_finder/test_covered_method.csv"
		# file = File.open(result_file_path, 'a')
		# file.puts('Test filename, Source filename, Covered methods, Touched lines')
		# file.close
		#
		# create json file
		result_file_path = "#{parent_dir_path}/DevOps-M4/results/test_covered_methods.json"
		
		# traverse separated test folder
		Dir.foreach(separated_test_folder) do |file_name|
			# bypass current dir and parent dir
			next if file_name == '.' or file_name == '..'
			# goto solar-calc dir; generate coverage.json; go back to current dir
			system("cd #{parent_dir_path}/solar-calc && \
				    ./node_modules/.bin/istanbul cover --report json ./node_modules/.bin/_mocha separated_tests/#{file_name} > out && \
				    cd #{parent_dir_path}/DevOps-M4/test_covered_method_finder")

			# read the coverage.json output and extract info
			file = File.read(json_file_path)
			json_content = JSON.parse(file)
			parse_istanbul_output(parent_dir_path, 
								  source_file_arr,
								  covered_method_hash,
								  cache_covered_method_hash, 
								  file_name, 
								  json_content, 
								  result_file_path)
		end
	end

	def cache_file_content_insertion(file_name)
		File.readlines(file_name).each do |line|
			
		end
	end

	def parse_istanbul_output(parent_dir_path, 
							  source_file_arr,
							  covered_method_hash,
							  cache_covered_method_hash, 
							  file_name, 
							  json_content,
							  result_file_path)

		#
		# write csv file
		#
		# file = File.open(result_file_path, 'w')
		# source_file_arr.each do |source_file|
		# 	key = "#{parent_dir_path}/solar-calc/lib/#{source_file}"
		# 	line_num = []
		# 	covered_methods = []
		# 	json_content[key]['s'].each do |map_id, value|
		# 		if value > 0 # occur more than one line
		# 			curr_line = json_content[key]['statementMap'][map_id]['start']['line']
		# 			unless line_num.include? curr_line
		# 				line_num << curr_line
		# 				# run method_finder.js and get method name
		# 				method_name = `cd #{parent_dir_path}/DevOps-M4/checker && \
		# 		    	    node method_finder.js ../../solar-calc/src/#{source_file}:#{curr_line} && \
		# 		    		cd #{parent_dir_path}/DevOps-M4/test_covered_method_finder`
		# 		    	covered_methods << method_name.sub("\n", '')
		# 		    end
		# 		end
		# 	end
		# 	puts "Checking covered method in [#{source_file}] by running test [#{file_name}] ..."
		# 	puts '-' * 10
		# 	file.puts("#{file_name}, #{source_file}, #{covered_methods.uniq.join(' | ')}, #{line_num.uniq.join('|')}")
		# end
		# file.close

		#
		# write json file - use method name and source filename as keys, test filename as values
		#
		source_file_arr.each do |source_file|
			key = "#{parent_dir_path}/solar-calc/lib/#{source_file}"
			line_num = []
			covered_methods = []
			json_content[key]['f'].each do |map_id, value|
				if value > 0 # occur more than one line
					curr_line = json_content[key]['fnMap'][map_id]['line']
					unless line_num.include? curr_line
						line_num << curr_line

						# check cache first
						if !cache_covered_method_hash[source_file].has_key? curr_line
							# run method_finder.js and get method name
							method_name = `cd #{parent_dir_path}/DevOps-M4/checker && \
					    	    node method_finder.js ../../solar-calc/lib/#{source_file}:#{curr_line} && \
					    		cd #{parent_dir_path}/DevOps-M4/test_covered_method_finder`
					    	method_name = method_name.sub("\n", '')
				    		# update cache_covered_method_hash
				    		cache_covered_method_hash[source_file][curr_line] = method_name
					    else
					    	method_name = cache_covered_method_hash[source_file][curr_line]
				    	end

				    	if !method_name.empty? and !covered_method_hash[source_file].has_key? method_name
				    		covered_method_hash[source_file][method_name] = []
				    	end

				    	if covered_method_hash[source_file][method_name] and !covered_method_hash[source_file][method_name].include? file_name
				    		# file_name here is test case filename
				    		covered_method_hash[source_file][method_name] << file_name
				    	end
				    end
				end
			end

			puts "Checking covered method in [#{source_file}] by running test [#{file_name}] ..."
			puts '-' * 10
		end
		file = File.open(result_file_path, 'w')
		file.puts(covered_method_hash.to_json)
		file.close
	end
end

tcmf = TestCoveredMethodFinder.new
tcmf.covered_methods(ARGV[0])
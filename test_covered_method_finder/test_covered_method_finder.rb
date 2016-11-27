require 'json'

# /Milestone4
class TestCoveredMethodFinder
	def generate_csv()
		parent_dir_path = File.expand_path("../../../", __FILE__)
		separated_test_folder = "#{parent_dir_path}/solar-calc/separated_tests"
		json_file_path = "#{parent_dir_path}/solar-calc/coverage/coverage.json"
		source_file_arr = ['moon.js', 'solarCalc.js', 'sun.js']; 

		# create file to store results
		result_file_path = "#{parent_dir_path}/DevOps-M4/test_covered_method_finder/test_covered_method.csv"
		file = File.open(result_file_path, 'a')
		file.puts('Test filename, Source filename, Covered methods, Touched lines')
		file.close

		# traverse separated test folder
		Dir.foreach(separated_test_folder) do |file_name|
			# bypass current dir and parent dir
			next if file_name == '.' or file_name == '..'
			# goto solar-calc dir; generate coverage.json; go back to current dir
			system("cd #{parent_dir_path}/solar-calc && \
				    ./node_modules/.bin/istanbul cover --report json ./node_modules/.bin/_mocha separated_tests/#{file_name} > out && \
				    rm out && \
				    cd #{parent_dir_path}/DevOps-M4/test_covered_method_finder")
			
			# read the coverage.json output and extract info
			file = File.read(json_file_path)
			json_content = JSON.parse(file)
			parse_istanbul_output(parent_dir_path, 
								  source_file_arr, 
								  file_name, 
								  json_content, 
								  result_file_path)
		end
	end

	def parse_istanbul_output(parent_dir_path, 
							  source_file_arr, 
							  file_name, 
							  json_content,
							  result_file_path)

		file = File.open(result_file_path, 'a')
		source_file_arr.each do |source_file|
			key = "#{parent_dir_path}/solar-calc/lib/#{source_file}"
			line_num = []
			covered_methods = []
			json_content[key]['s'].each do |map_id, value|
				if value > 0 # occur more than one line
					curr_line = json_content[key]['statementMap'][map_id]['start']['line']
					unless line_num.include? curr_line
						line_num << curr_line
						# run method_finder.js and get method name
						method_name = `cd #{parent_dir_path}/DevOps-M4/checker && \
				    	    node method_finder.js ../../solar-calc/src/#{source_file}:#{curr_line} && \
				    		cd #{parent_dir_path}/DevOps-M4/test_covered_method_finder`
				    	covered_methods << method_name.sub("\n", '')
				    end
				end
			end
			puts "Checking covered method in [#{source_file}] by running test [#{file_name}] ..."
			puts '-' * 10
			file.puts("#{file_name}, #{source_file}, #{covered_methods.uniq.join(' | ')}, #{line_num.uniq.join('|')}")
		end
		file.close
	end
end

tcmf = TestCoveredMethodFinder.new
tcmf.generate_csv
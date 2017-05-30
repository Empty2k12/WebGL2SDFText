package de.gerogerke.fnttojson;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

public class Main {

	public static void main(String[] args) throws IOException, JSONException {
		
		JSONObject infoObj = new JSONObject();
		JSONObject charsObj = new JSONObject();
		
		String[] lines = readLines("src/text.fnt");
		for(String line : lines) {
			
			JSONObject partOutput = new JSONObject();
			String id = "";
			
			if(line.startsWith("common ")) {
				parseCommonInfo(infoObj, line);
			} else if(line.startsWith("char ")) {
				line = line.replace("char ", "");
				String[] parts = line.split(" +");
				for(String part : parts) {
					String[] segments = part.split("=");
					
					if(segments[0].equalsIgnoreCase("id")) {
						id = segments[1];
					}
					
					if(!Arrays.asList(new String[] {"chnl", "page", "id"}).contains(segments[0])) {
						partOutput.put(segments[0], segments[1]);
					}
				}
				charsObj.put(id, partOutput);
			} else if(line.startsWith("kerning ")) {
				line = line.replace("kerning ", "");
				
				String[] parts = line.split(" +");
				
				String first = "";
				String second = "";
				String amount = "";
				for(String part : parts) {
					String[] segments = part.split("=");
					
					if(segments[0].equalsIgnoreCase("first")) {
						first = segments[1];
					} else if(segments[0].equalsIgnoreCase("second")) {
						second = segments[1];
					} else if(segments[0].equalsIgnoreCase("amount")) {
						amount = segments[1];
					}
				}
				
				//Create kernings Object if it does not exist
				JSONObject char_ = ((JSONObject)charsObj.get(first));
				if(!char_.has("kernings")) {
					char_.put("kernings", new JSONObject());
				}
				
				JSONObject kernings = char_.getJSONObject("kernings");
				kernings.put(second, amount);
			}
		}
		
		JSONObject mainObj = new JSONObject();
		mainObj.put("chars", charsObj);
		mainObj.put("info", infoObj);
		
		System.out.println(mainObj.toString());
	}
	
	public static void parseCommonInfo(JSONObject infoObj, String commonLine) throws JSONException {
		String[] parts = commonLine.split(" +");
		
		int[] items = {1, 2};
		for(int index : items) {
			String[] lineHeightInfo = parts[index].split("=");
			infoObj.put(lineHeightInfo[0], lineHeightInfo[1]);
		}
	}
	
	public static String[] readLines(String filename) throws IOException {
        FileReader fileReader = new FileReader(filename);
        BufferedReader bufferedReader = new BufferedReader(fileReader);
        List<String> lines = new ArrayList<String>();
        String line = null;
        while ((line = bufferedReader.readLine()) != null) {
            lines.add(line);
        }
        bufferedReader.close();
        return lines.toArray(new String[lines.size()]);
    }

}
